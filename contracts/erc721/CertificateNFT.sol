// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CertificateNFT
 * @notice Optimized ERC-721-like certificate system for Arbitrum Sepolia
 * @dev Focuses on minimal gas consumption and storage efficiency
 */

contract CertificateNFT {
    // ============ CONSTANTS ============
    
    string public constant name = "Certificate NFT";
    string public constant symbol = "CERT";
    uint8 public constant decimals = 0;

    // ============ STATE VARIABLES ============
    
    /// @notice Admin address with authority to issue and revoke certificates
    address public admin;

    /// @notice Total number of certificates issued
    uint256 public totalSupply;

    /// @notice Mapping: tokenId => owner address
    mapping(uint256 => address) public ownerOf;

    /// @notice Mapping: owner address => balance
    mapping(address => uint256) public balanceOf;

    /// @notice Mapping: tokenId => certificate data hash (keccak256 of certificate info)
    mapping(uint256 => bytes32) public certificateHash;

    /// @notice Mapping: tokenId => issued timestamp
    mapping(uint256 => uint256) public issuedAt;

    /// @notice Mapping: tokenId => revocation status (true = revoked)
    mapping(uint256 => bool) public isRevoked;

    /// @notice Base URI for token metadata
    string public baseURI = "https://certificate-nft.example.com/metadata/";

    // ============ EVENTS ============

    event CertificateIssued(
        uint256 indexed tokenId,
        address indexed recipient,
        string studentName,
        string courseName,
        string grade,
        string institution,
        uint256 timestamp
    );

    event CertificateRevoked(uint256 indexed tokenId);

    event AdminChanged(address indexed previousAdmin, address indexed newAdmin);

    // ERC-721 compatible events
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

    // ============ MODIFIERS ============

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    // ============ CONSTRUCTOR ============

    constructor() {
        admin = msg.sender;
        totalSupply = 0;
    }

    // ============ ADMIN FUNCTIONS ============

    /**
     * @notice Change admin address
     * @param newAdmin The new admin address
     */
    function changeAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid admin address");
        address previousAdmin = admin;
        admin = newAdmin;
        emit AdminChanged(previousAdmin, newAdmin);
    }

    // ============ CERTIFICATE ISSUANCE ============

    /**
     * @notice Issue a new certificate to a recipient
     * @param recipient The address receiving the certificate
     * @param studentName Student's name (emitted in event, not stored)
     * @param courseName Course name (emitted in event, not stored)
     * @param grade Grade achieved (emitted in event, not stored)
     * @param institution Institution name (emitted in event, not stored)
     * @return tokenId The newly minted certificate token ID
     *
     * Gas optimization:
     * - String data stored in events (0 storage cost)
     * - Only hash stored on-chain (minimal storage)
     * - Certificate metadata retrieved from event logs (off-chain indexing)
     */
    function issueCertificate(
        address recipient,
        string calldata studentName,
        string calldata courseName,
        string calldata grade,
        string calldata institution
    ) external onlyAdmin returns (uint256) {
        require(recipient != address(0), "Invalid recipient address");

        // Generate shorter, random token ID based on certificate data
        // Creates an 8-digit random ID (10,000,000 - 99,999,999)
        uint256 randomHash = uint256(keccak256(
            abi.encodePacked(
                recipient,
                studentName,
                courseName,
                grade,
                institution,
                block.timestamp,
                blockhash(block.number - 1),
                totalSupply
            )
        ));

        // Reduce to 8-digit range: 10000000 to 99999999
        uint256 tokenId = 10000000 + (randomHash % 90000000);

        // Check if token already exists (collision prevention)
        require(ownerOf[tokenId] == address(0), "Token ID already exists");

        // Increment total supply counter
        totalSupply++;

        // Store minimal data on-chain
        ownerOf[tokenId] = recipient;
        balanceOf[recipient]++;

        // Create hash of certificate data (for verification without storing strings)
        bytes32 dataHash = keccak256(
            abi.encodePacked(
                recipient,
                studentName,
                courseName,
                grade,
                institution
            )
        );
        certificateHash[tokenId] = dataHash;
        issuedAt[tokenId] = block.timestamp;

        // Emit complete certificate info in event (stored off-chain)
        emit CertificateIssued(
            tokenId,
            recipient,
            studentName,
            courseName,
            grade,
            institution,
            block.timestamp
        );

        // ERC-721 compatible transfer event
        emit Transfer(address(0), recipient, tokenId);

        return tokenId;
    }

    // ============ CERTIFICATE REVOCATION ============

    /**
     * @notice Revoke a certificate
     * @param tokenId The certificate token ID to revoke
     */
    function revokeCertificate(uint256 tokenId) external onlyAdmin {
        require(ownerOf[tokenId] != address(0), "Certificate does not exist");
        require(!isRevoked[tokenId], "Certificate already revoked");

        isRevoked[tokenId] = true;
        emit CertificateRevoked(tokenId);
    }

    // ============ CERTIFICATE VERIFICATION ============

    /**
     * @notice Verify a certificate exists and is valid
     * @param tokenId The certificate token ID
     * @return owner The certificate owner
     * @return timestamp When the certificate was issued
     * @return valid Whether the certificate is still valid (not revoked)
     * @return dataHash Hash of the certificate data for verification
     */
    function verifyCertificate(uint256 tokenId)
        external
        view
        returns (
            address owner,
            uint256 timestamp,
            bool valid,
            bytes32 dataHash
        )
    {
        require(ownerOf[tokenId] != address(0), "Certificate does not exist");

        owner = ownerOf[tokenId];
        timestamp = issuedAt[tokenId];
        valid = !isRevoked[tokenId];
        dataHash = certificateHash[tokenId];
    }

    /**
     * @notice Verify certificate authenticity by comparing hashes
     * @param tokenId The certificate to verify
     * @param recipient Expected recipient address
     * @param studentName Expected student name
     * @param courseName Expected course name
     * @param grade Expected grade
     * @param institution Expected institution
     * @return isValid True if all data matches and certificate is not revoked
     */
    function verifyCertificateData(
        uint256 tokenId,
        address recipient,
        string calldata studentName,
        string calldata courseName,
        string calldata grade,
        string calldata institution
    ) external view returns (bool) {
        require(ownerOf[tokenId] != address(0), "Certificate does not exist");

        bytes32 expectedHash = keccak256(
            abi.encodePacked(
                recipient,
                studentName,
                courseName,
                grade,
                institution
            )
        );

        return (
            certificateHash[tokenId] == expectedHash &&
            !isRevoked[tokenId] &&
            ownerOf[tokenId] == recipient
        );
    }

    // ============ VIEW FUNCTIONS ============

    /**
     * @notice Get certificate owner
     * @param tokenId The token ID
     * @return The owner address
     */
    function getOwner(uint256 tokenId) external view returns (address) {
        require(ownerOf[tokenId] != address(0), "Token does not exist");
        return ownerOf[tokenId];
    }

    /**
     * @notice Check if certificate is valid
     * @param tokenId The token ID
     * @return True if certificate exists and is not revoked
     */
    function isValid(uint256 tokenId) external view returns (bool) {
        return ownerOf[tokenId] != address(0) && !isRevoked[tokenId];
    }

    /**
     * @notice Get certificate data hash
     * @param tokenId The token ID
     * @return The keccak256 hash of certificate data
     */
    function getCertificateHash(uint256 tokenId) external view returns (bytes32) {
        require(ownerOf[tokenId] != address(0), "Certificate does not exist");
        return certificateHash[tokenId];
    }

    /**
     * @notice Get issuance timestamp
     * @param tokenId The token ID
     * @return The block timestamp when issued
     */
    function getIssuedAt(uint256 tokenId) external view returns (uint256) {
        require(ownerOf[tokenId] != address(0), "Certificate does not exist");
        return issuedAt[tokenId];
    }

    /**
     * @notice Get token URI for metadata (ERC-721 standard)
     * Returns base64-encoded JSON metadata so MetaMask can display the NFT
     * @param tokenId The token ID
     * @return The data URI with base64-encoded JSON metadata
     */
    function tokenURI(uint256 tokenId) external view returns (string memory) {
        require(ownerOf[tokenId] != address(0), "Certificate does not exist");
        
        string memory status = isRevoked[tokenId] ? "Revoked" : "Valid";
        
        // Create JSON metadata
        string memory json = string(abi.encodePacked(
            '{"name":"Certificate NFT #',
            uintToString(tokenId),
            '","description":"Blockchain Certificate - Token ID: ',
            uintToString(tokenId),
            '","image":"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzAwMzM2NiIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9IjIwMCIgeT0iMTAwIiBmb250LXNpemU9IjQ4IiBmaWxsPSIjRkZGIiBmb250LWZhbWlseT0iQXJpYWwiPkNlcnRpZmljYXRlPC90ZXh0Pjwvc3ZnPg==","attributes":[{"trait_type":"Status","value":"',
            status,
            '"},{"trait_type":"Token ID","value":"',
            uintToString(tokenId),
            '"}]}'
        ));
        
        return  string(abi.encodePacked("data:application/json;base64,", base64Encode(bytes(json))));
    }

    /**
     * @notice Set base URI for token metadata (admin only)
     * @param newBaseURI The new base URI
     */
    function setBaseURI(string calldata newBaseURI) external onlyAdmin {
        baseURI = newBaseURI;
    }

    /**
     * @notice Convert uint to string (for token URI generation)
     * @param value The uint value to convert
     * @return The string representation
     */
    function uintToString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    /**
     * @notice Encode bytes to base64 string
     * @param data The bytes to encode
     * @return The base64 encoded string
     */
    function base64Encode(bytes memory data) internal pure returns (string memory) {
        bytes memory TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        if (data.length == 0) return "";
        
        uint256 encodedLen = 4 * ((data.length + 2) / 3);
        bytes memory encoded = new bytes(encodedLen + 32);
        
        uint256 j = 0;
        uint256 i = 0;
        
        while (i + 3 <= data.length) {
            uint256 b0 = uint8(data[i]);
            uint256 b1 = uint8(data[i + 1]);
            uint256 b2 = uint8(data[i + 2]);
            
            encoded[j] = TABLE[(b0 >> 2) & 0x3F];
            encoded[j + 1] = TABLE[((b0 & 0x03) << 4) | ((b1 >> 4) & 0x0F)];
            encoded[j + 2] = TABLE[((b1 & 0x0F) << 2) | ((b2 >> 6) & 0x03)];
            encoded[j + 3] = TABLE[b2 & 0x3F];
            
            i += 3;
            j += 4;
        }
        
        if (i < data.length) {
            uint256 b0 = uint8(data[i]);
            encoded[j] = TABLE[(b0 >> 2) & 0x3F];
            if (i + 1 < data.length) {
                uint256 b1 = uint8(data[i + 1]);
                encoded[j + 1] = TABLE[((b0 & 0x03) << 4) | ((b1 >> 4) & 0x0F)];
                encoded[j + 2] = TABLE[(b1 & 0x0F) << 2];
            } else {
                encoded[j + 1] = TABLE[(b0 & 0x03) << 4];
                encoded[j + 2] = TABLE[0];
            }
            encoded[j + 3] = TABLE[0];
        }
        
        bytes memory result = new bytes(encodedLen);
        for (i = 0; i < encodedLen; i++) {
            result[i] = encoded[i];
        }
        
        return string(result);
    }
}
