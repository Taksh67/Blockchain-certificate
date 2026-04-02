# CertificateNFT - Quick Reference

## Deploy on Remix IDE

### Steps:
1. Go to https://remix.ethereum.org
2. Create new file: `CertificateNFT.sol`
3. Copy the contract code
4. Compile with Solidity 0.8.19+
5. Deploy with initialAdmin address (your institution's admin wallet)

### After Deployment

**Contract Functions Quick Access:**

```javascript
// Issue a certificate
await contract.issueCertificate(
  recipientAddress,
  "Student Name",
  "Course Name",
  "A+",
  "Institution Name"
)

// Verify a certificate
await contract.verifyCertificate(tokenId)

// Get certificate details
await contract.getCertificateDetails(tokenId)

// Get all student certificates
await contract.getCertificatesByOwner(studentAddress)

// Revoke a certificate (admin only)
await contract.revokeCertificate(tokenId)

// Check if revoked
await contract.isCertificateRevoked(tokenId)

// Get total certificates issued
await contract.getTotalCertificates()
```

## Integration with Frontend

### Connect via ethers.js or wagmi
```javascript
const certificateContract = new ethers.Contract(
  contractAddress,
  certificateABI,
  signer
)

// Issue certificate
const tx = await certificateContract.issueCertificate(
  recipientAddress,
  studentName,
  courseName,
  grade,
  institution
)
```

## Network Configuration

### Arbitrum Sepolia (Testnet)
- Chain ID: 421614
- RPC: https://sepolia-rollup.arbitrum.io:8443
- Block Explorer: https://sepolia.arbiscan.io

### Ethereum Mainnet
- Chain ID: 1
- RPC: https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
- Block Explorer: https://etherscan.io

## Contract ABI Export
After deployment on Remix, export the ABI for frontend integration:
1. Click on contract name in "Compiled Contracts"
2. Click copy ABI button
3. Save as `certificateNFT_abi.json` in frontend's lib/abis/

## Verification on Block Explorer
After deployment, verify your contract using Flattened Source:
1. Tools → Flatten (combines all imports into one file)
2. Go to block explorer → contract address
3. Click "Verify and Publish"
4. Paste flattened contract code
5. Compiler: 0.8.19
6. License: MIT

## Common Issues & Solutions

**Issue**: "Only admin can call this function"
**Solution**: Make sure you're connected with the admin wallet address

**Issue**: "Certificate does not exist"
**Solution**: Token ID might be incorrect or not issued yet

**Issue**: "Invalid recipient address"
**Solution**: Check that recipient address is a valid Ethereum address (0x...)

## Events to Monitor

Listen for certificate issuance in your frontend:
```javascript
contract.on("CertificateIssued", (tokenId, recipient, studentName, courseName, grade, institution) => {
  console.log(`Certificate ${tokenId} issued to ${recipient}`)
})
```
