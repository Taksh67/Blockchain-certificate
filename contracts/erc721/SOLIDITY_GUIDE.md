# Solidity Smart Contract - CertificateNFT

## Overview
CertificateNFT is an ERC-721 compatible smart contract for issuing tamper-proof, blockchain-based digital certificates. Each certificate is minted as a unique NFT that stores complete metadata on-chain.

## Features

### Core Functionality
- **Issue Certificates**: Admin-only function to mint certificates to student wallets
- **Verify Certificates**: Check if a certificate is valid (exists and not revoked)
- **Revoke Certificates**: Admin can revoke certificates if needed
- **Certificate Metadata**: On-chain storage of student name, course name, grade, and institution

### ERC-721 Compliance
- Full ERC-721 standard implementation
- ERC-721Enumerable for efficient batch operations
- ERC-721URIStorage for IPFS metadata support
- Ownable pattern for admin management

## Contract Functions

### Public Functions

#### `issueCertificate(address recipient, string memory studentName, string memory courseName, string memory grade, string memory institution) → uint256`
Issues a new certificate NFT to a recipient.
- **Parameters**:
  - `recipient`: Wallet address receiving the certificate
  - `studentName`: Full name of the student
  - `courseName`: Name of the completed course
  - `grade`: Grade/score achieved
  - `institution`: Name of issuing institution
- **Returns**: Token ID of the newly issued certificate
- **Requires**: Only admin can call
- **Emits**: `CertificateIssued` event

#### `revokeCertificate(uint256 tokenId)`
Revokes a certificate, marking it as invalid.
- **Parameters**: `tokenId` - ID of certificate to revoke
- **Requires**: Only admin can call, certificate must exist
- **Emits**: `CertificateRevoked` event

#### `verifyCertificate(uint256 tokenId) → bool`
Checks if a certificate is valid (exists and not revoked).
- **Returns**: `true` if certificate is valid, `false` otherwise

#### `getCertificateDetails(uint256 tokenId) → Certificate`
Retrieves full certificate data.
- **Returns**: Certificate struct with all metadata
- **Requires**: Certificate must exist

#### `isCertificateRevoked(uint256 tokenId) → bool`
Checks revocation status.
- **Returns**: `true` if certificate is revoked

#### `getCertificatesByOwner(address owner) → uint256[]`
Gets all certificates owned by an address.
- **Returns**: Array of token IDs

#### `setAdmin(address newAdmin)`
Changes the certificate issuer admin address.
- **Requires**: Only contract owner can call

## Data Structures

### Certificate Struct
```solidity
struct Certificate {
    string studentName;
    string courseName;
    string grade;
    string institution;
    uint256 issuedDate;
    bool revoked;
}
```

## Events

- **CertificateIssued**: Emitted when a new certificate is issued
- **CertificateRevoked**: Emitted when a certificate is revoked
- **AdminChanged**: Emitted when admin address changes

## Deployment

### Prerequisites
- OpenZeppelin Contracts library
- Solidity ^0.8.19
- Target network: Arbitrum Sepolia, Ethereum Mainnet, or compatible EVM chain

### Variables to Set
- `initialAdmin`: Address that can issue and revoke certificates (usually institution admin)

## Gas Optimization Notes
- Enumerable extensions allow efficient querying of certificate ownership
- On-chain metadata storage ensures certificates are permanently verifiable
- Revocation is flagged rather than burning to preserve history

## Security Considerations
- Only contract owner can change admin
- Only designated admin can issue/revoke certificates
- No certificate can be transferred to address(0)
- Revocation is irreversible
