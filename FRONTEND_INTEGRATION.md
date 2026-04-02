# Frontend Integration Guide - Optimized Contract (v3.0)

## 🔄 Required Changes for Your UI Pages

Your frontend pages need to be updated to work with the new contract function signatures and return values.

---

## 1. pages/issue/page.tsx - Certificate Issuance

### What's Changed

✅ Function name changed: `issue_certificate` → `issueCertificate` (camelCase)
✅ Return type stays the same: `uint256` (the random token ID)
⚠️ Token IDs are now 8-digit random numbers, not sequential!

### Current Code (Old)
```typescript
// This will NOT work anymore - wrong function name
const tx = await contract.issue_certificate(
  recipientAddress,
  studentName,
  courseName,
  grade,
  institution
);
```

### Updated Code (New)
```typescript
// Updated function call
const tx = await contract.issueCertificate(
  recipientAddress,
  studentName,
  courseName,
  grade,
  institution
);

// Await transaction
const result = await tx.wait();

// Extract the token ID from the event (it's random now!)
const receipt = result; // Get receipt after confirmation
console.log(`Certificate issued with Token ID: ${receipt.logs[0].topics[1]}`);

// Or better: listen to the emitted event
contract.once("CertificateIssued", (tokenId, recipient, name, course, grade, institution) => {
  console.log(`New certificate #${tokenId} issued to ${recipient}`);
  // Update UI with random token ID
});
```

### UI Updates Needed

```typescript
// Handle random token IDs in display
function displayTokenId(tokenId) {
  // Old: "Certificate #1, #2, #3..."
  // New: "Certificate #57284619, #83461925..." (8-digit)
  return `Certificate #${tokenId}`;
}

// Update success message to show the random ID
setSuccessMessage(`Certificate issued successfully! Token ID: ${tokenId}`);
```

---

## 2. pages/verify/page.tsx - Certificate Verification ⚠️ CRITICAL

### What's Changed

❌ Function name changed: `verify_certificate` → `verifyCertificate` (camelCase)
❌ **Return type completely changed!** String data → tuple (address, uint256, bool, bytes32)

### The Problem

**Old Contract:**
```solidity
function verifyCertificate(uint256 tokenId)
  returns (
    string studentName,
    string courseName,
    string grade,
    string institution,
    uint256 issuedAt,
    bool isValid
  )
```

**New Contract:**
```solidity
function verifyCertificate(uint256 tokenId)
  returns (
    address owner,      // Who owns it
    uint256 timestamp,  // When issued
    bool valid,         // Not revoked?
    bytes32 dataHash    // Data verification hash
  )
```

**Your UI was expecting strings, contract now returns only metadata!**

### Solution 1: Require User Input (RECOMMENDED - Simplest)

Show basic info from contract, let user verify the hash:

```typescript
// pages/verify/page.tsx - Solution 1

const [tokenId, setTokenId] = useState("");
const [certificateData, setCertificateData] = useState(null);
const [verificationInput, setVerificationInput] = useState({
  recipient: "",
  studentName: "",
  courseName: "",
  grade: "",
  institution: ""
});

async function handleVerify() {
  try {
    // Step 1: Get basic info from contract
    const [owner, timestamp, isValid, dataHash] = await contract.verifyCertificate(tokenId);
    
    // Step 2: Show what we found on-chain
    setCertificateData({
      owner,
      timestamp,
      isValid,
      dataHash
    });
    
  } catch (error) {
    console.error("Certificate not found", error);
  }
}

async function handleVerifyData() {
  try {
    // Step 3: User provides their data to verify it matches
    const isAuthentic = await contract.verifyCertificateData(
      tokenId,
      verificationInput.recipient,
      verificationInput.studentName,
      verificationInput.courseName,
      verificationInput.grade,
      verificationInput.institution
    );
    
    if (isAuthentic && certificateData.isValid) {
      setMessage("✅ Certificate is authentic and not revoked!");
    } else if (!isAuthentic) {
      setMessage("❌ Certificate data does not match!");
    } else {
      setMessage("❌ Certificate has been revoked!");
    }
  } catch (error) {
    setMessage("❌ Verification failed", error);
  }
}

// UI Structure:
return (
  <div>
    <h1>Verify Certificate</h1>
    
    {/* Step 1: Enter Token ID */}
    <input 
      type="number"
      placeholder="Token ID (e.g., 57284619)"
      value={tokenId}
      onChange={(e) => setTokenId(e.target.value)}
    />
    <button onClick={handleVerify}>Look Up Certificate</button>
    
    {/* Step 2: Show on-chain data */}
    {certificateData && (
      <div>
        <p>Owner: {certificateData.owner}</p>
        <p>Issued: {new Date(certificateData.timestamp * 1000).toLocaleDateString()}</p>
        <p>Status: {certificateData.isValid ? "Valid ✓" : "Revoked ✗"}</p>
      </div>
    )}
    
    {/* Step 3: User provides data to verify */}
    {certificateData && (
      <div>
        <h3>Enter Certificate Details to Verify:</h3>
        <input 
          placeholder="Recipient Address"
          value={verificationInput.recipient}
          onChange={(e) => setVerificationInput({...verificationInput, recipient: e.target.value})}
        />
        <input 
          placeholder="Student Name"
          value={verificationInput.studentName}
          onChange={(e) => setVerificationInput({...verificationInput, studentName: e.target.value})}
        />
        <input 
          placeholder="Course Name"
          value={verificationInput.courseName}
          onChange={(e) => setVerificationInput({...verificationInput, courseName: e.target.value})}
        />
        <input 
          placeholder="Grade"
          value={verificationInput.grade}
          onChange={(e) => setVerificationInput({...verificationInput, grade: e.target.value})}
        />
        <input 
          placeholder="Institution"
          value={verificationInput.institution}
          onChange={(e) => setVerificationInput({...verificationInput, institution: e.target.value})}
        />
        <button onClick={handleVerifyData}>Verify Data Authenticity</button>
      </div>
    )}
  </div>
);
```

### Solution 2: Index Events (ADVANCED - Better UX)

Retrieve certificate details from event logs via The Graph or subgraph:

```typescript
// Advanced: Query events to show certificate details
async function getCertificateDetailsFromEvents(tokenId) {
  // Query The Graph or use ethers.js event filtering
  const filter = contract.filters.CertificateIssued(tokenId);
  const events = await contract.queryFilter(filter);
  
  if (events.length === 0) return null;
  
  const event = events[0];
  return {
    tokenId: event.args.tokenId,
    studentName: event.args.studentName,
    courseName: event.args.courseName,
    grade: event.args.grade,
    institution: event.args.institution,
    timestamp: event.args.timestamp
  };
}
```

**This requires:**
- The Graph subgraph setup, OR
- Full node access to query historical logs
- More complex infrastructure

**For now, use Solution 1 (user input)** - simpler and works immediately!

---

## 3. pages/profile/page.tsx (if it exists)

### What's Changed
- Function name: `total_supply` → `totalSupply` (state variable, not function)
- All other read-only functions work the same

### Updated Code
```typescript
// Old
const total = await contract.total_supply();

// New
const total = await contract.totalSupply();

// Get user's certificate count
const userBalance = await contract.balanceOf(userAddress);

// Get user's tokens (need to track from events or enumerate)
```

---

## 4. contract.ts ABI File ✅ ALREADY UPDATED

The ABI file has been updated with all new function signatures. Your contract.ts file now includes:

```typescript
export const CertificateNFT_ABI = [
  // ... all function definitions with new signatures
  {
    name: "issueCertificate",
    inputs: [...],
    outputs: [{ type: "uint256" }]
  },
  {
    name: "verifyCertificate",
    inputs: [...],
    outputs: [
      { name: "owner", type: "address" },
      { name: "timestamp", type: "uint256" },
      { name: "valid", type: "bool" },
      { name: "dataHash", type: "bytes32" }
    ]
  },
  // ... more functions
];
```

✅ No changes needed here - already done!

---

## 📋 Checklist for Updates

- [ ] Update `pages/issue/page.tsx`
  - [ ] Change `issue_certificate` → `issueCertificate`
  - [ ] Handle random token ID display
  - [ ] Update success message to show random token ID

- [ ] Update `pages/verify/page.tsx`
  - [ ] Change `verify_certificate` → `verifyCertificate`
  - [ ] Accept user input for certificate data
  - [ ] Call `verifyCertificateData()` to verify hash
  - [ ] Display owner, timestamp, valid status
  - [ ] Show verification result

- [ ] Update `pages/profile/page.tsx` (if exists)
  - [ ] Change `total_supply()` → `totalSupply`
  - [ ] Use `balanceOf()` for user certificates
  - [ ] Test certificate enumeration

- [ ] Update wallet connection
  - [ ] Verify ABI is loaded correctly
  - [ ] Test contract interactions
  - [ ] Handle new return types

---

## 🧪 Testing Plan

### 1. Issue a Certificate
```
Input: Recipient address, name, course, grade, institution
Expected: Random 8-digit token ID (e.g., 57284619)
Verify: Transaction mined, event emitted
```

### 2. Verify Certificate Lookup
```
Input: Token ID (57284619)
Expected: owner address, timestamp, valid status
Verify: Correct data returned
```

### 3. Verify Certificate Data
```
Input: Token ID + original certificate data
Expected: true if data matches, false if different
Verify: Tamper-proof verification works
```

### 4. Revoke Certificate
```
Input: Token ID
Expected: Certificate marked as revoked
Verify: verifyCertificate returns valid=false
```

### 5. Display in Wallet
```
Input: tokenURI(tokenId)
Expected: Base64-encoded JSON with SVG image
Verify: NFT shows in MetaMask, OpenSea, etc.
```

---

## 🚨 Common Issues & Solutions

### Issue: "issueCertificate is not a function"
**Cause:** Contract ABI not loaded or function name typo
**Solution:** Check contract.ts ABI, verify NEXT_PUBLIC_CONTRACT_ADDRESS is set

### Issue: "Cannot read property 'owner' of undefined"
**Cause:** Contract call returned undefined (certificate doesn't exist)
**Solution:** Check token ID exists, verify token ID format

### Issue: "Data validation failed"
**Cause:** User entered certificate data that doesn't match stored hash
**Solution:** This is correct behavior! Data was not tampered with if true

### Issue: "Random token IDs are not sequential anymore"
**Expected:** Token IDs are now 8-digit random #57284619, #83461925, etc.
**Why:** Better security and more human-friendly NFT IDs

---

## 📝 Implementation Example (Complete)

Here's a working example for pages/verify/page.tsx:

```typescript
'use client';

import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { CertificateNFT_ABI } from '@/lib/contract';

export default function VerifyPage() {
  const [tokenId, setTokenId] = useState("");
  const [verificationInputs, setVerificationInputs] = useState({
    recipient: "",
    studentName: "",
    courseName: "",
    grade: "",
    institution: ""
  });
  const [certificateData, setCertificateData] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [message, setMessage] = useState("");

  // Read from contract
  const { data: certificateInfo } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: CertificateNFT_ABI,
    functionName: 'verifyCertificate',
    args: [BigInt(tokenId)],
    enabled: !!tokenId && !isNaN(tokenId)
  });

  // Verify certificate data
  const { data: isDataValid } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: CertificateNFT_ABI,
    functionName: 'verifyCertificateData',
    args: [
      BigInt(tokenId),
      verificationInputs.recipient,
      verificationInputs.studentName,
      verificationInputs.courseName,
      verificationInputs.grade,
      verificationInputs.institution
    ],
    enabled: !!tokenId && Object.values(verificationInputs).every(v => v.length > 0)
  });

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Verify Certificate</h1>
      
      {/* Token ID Lookup */}
      <div className="space-y-4">
        <input
          type="number"
          placeholder="Enter Token ID (e.g., 57284619)"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Certificate Info from Contract */}
      {certificateInfo && (
        <div className="bg-blue-50 p-4 rounded space-y-2">
          <p><strong>Owner:</strong> {certificateInfo[0]}</p>
          <p><strong>Issued:</strong> {new Date(Number(certificateInfo[1]) * 1000).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {certificateInfo[2] ? "✅ Valid" : "❌ Revoked"}</p>
          <p><strong>Data Hash:</strong> {certificateInfo[3].toString()}</p>
        </div>
      )}

      {/* Data Verification */}
      {certificateInfo && (
        <div className="space-y-4 border-t pt-6">
          <h2 className="text-xl font-bold">Verify Certificate Data</h2>
          
          <input
            placeholder="Recipient Address"
            value={verificationInputs.recipient}
            onChange={(e) => setVerificationInputs({...verificationInputs, recipient: e.target.value})}
            className="w-full p-2 border rounded"
          />
          
          <input
            placeholder="Student Name"
            value={verificationInputs.studentName}
            onChange={(e) => setVerificationInputs({...verificationInputs, studentName: e.target.value})}
            className="w-full p-2 border rounded"
          />
          
          <input
            placeholder="Course Name"
            value={verificationInputs.courseName}
            onChange={(e) => setVerificationInputs({...verificationInputs, courseName: e.target.value})}
            className="w-full p-2 border rounded"
          />
          
          <input
            placeholder="Grade"
            value={verificationInputs.grade}
            onChange={(e) => setVerificationInputs({...verificationInputs, grade: e.target.value})}
            className="w-full p-2 border rounded"
          />
          
          <input
            placeholder="Institution"
            value={verificationInputs.institution}
            onChange={(e) => setVerificationInputs({...verificationInputs, institution: e.target.value})}
            className="w-full p-2 border rounded"
          />

          {/* Verification Result */}
          {isDataValid !== undefined && (
            <div className={`p-4 rounded ${isDataValid ? 'bg-green-50' : 'bg-red-50'}`}>
              {isDataValid && certificateInfo[2] ? (
                <p className="text-green-700">✅ Certificate is authentic and valid!</p>
              ) : !certificateInfo[2] ? (
                <p className="text-red-700">❌ Certificate has been revoked!</p>
              ) : (
                <p className="text-red-700">❌ Certificate data does not match! The certificate appears to be tampered with.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## ✅ Summary

**Files to Update:**
1. `pages/issue/page.tsx` - Use `issueCertificate` (camelCase), handle 8-digit random IDs
2. `pages/verify/page.tsx` - Use new return tuple, require user input for verification
3. `contract.ts` - ✅ Already done!

**Key Changes:**
- All function names now use camelCase
- `verifyCertificate` returns metadata, not string data
- Token IDs are now 8-digit random numbers
- Use `verifyCertificateData` to verify certificate authenticity

**Testing:**
- Test on Arbitrum Sepolia testnet
- Verify random token ID generation
- Test hash-based verification
- Ensure NFT displays in wallet

Your optimized contract is ready to deploy and integrate! 🚀
