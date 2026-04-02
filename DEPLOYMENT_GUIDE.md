# Deployment Guide - Optimized CertificateNFT Contract

Step-by-step instructions for deploying the new optimized contract to Arbitrum Sepolia.

---

## 📋 Pre-Deployment Checklist

- [ ] You have Arbitrum Sepolia ETH for gas (free testnet faucet available)
- [ ] Your wallet address is ready
- [ ] You have the contract code (CertificateNFT.sol)
- [ ] Frontend is ready with updated ABI

---

## 🚀 Option 1: Remix IDE (Easiest - No Setup)

**Best for:** Quick testing and learning

### Step 1: Open Remix
1. Go to https://remix.ethereum.org
2. Create new file: `CertificateNFT.sol`
3. Copy entire contract code into the file

### Step 2: Compile
1. Click **Solidity Compiler** (left sidebar)
2. Set compiler to `0.8.20`
3. Click **Compile CertificateNFT.sol**
4. Should show ✅ (green checkmark, no errors)

### Step 3: Deploy
1. Click **Deploy & Run Transactions** (left sidebar)
2. Set **Environment** to "Injected Provider - MetaMask"
3. Connect your MetaMask wallet to **Arbitrum Sepolia**
   - In MetaMask settings, enable "Show test networks"
   - Switch to Arbitrum Sepolia
4. Set **Contract** to "CertificateNFT"
5. Click **Deploy**
6. Confirm transaction in MetaMask
7. Wait for confirmation (~1 minute)

### Step 4: Verify Deployment
1. Contract appears under **Deployed Contracts**
2. Copy the contract address
3. Visit https://sepolia.arbiscan.io
4. Search the address - should show your contract

### Step 5: Update Frontend
```bash
# In .env.local or .env file in /apps/web/
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...  # Your deployed address
```

---

## 🛠️ Option 2: Hardhat (Recommended - Most Control)

**Best for:** Production deployments and testing

### Step 1: Create Deploy Script

Create file: `scripts/deploy-erc721-v3.ts`

```typescript
import hre from "hardhat";

async function main() {
  console.log("Deploying CertificateNFT to Arbitrum Sepolia...");

  const CertificateNFT = await hre.ethers.getContractFactory("CertificateNFT");
  const contract = await CertificateNFT.deploy();

  await contract.waitForDeployment();

  const deployedAddress = await contract.getAddress();
  console.log("✅ CertificateNFT deployed to:", deployedAddress);

  // Verify admin
  const admin = await contract.admin();
  console.log("✅ Admin set to:", admin);

  // Save to file for reference
  const fs = require("fs");
  fs.writeFileSync(
    "deployed-addresses.json",
    JSON.stringify(
      {
        certificateNFT: deployedAddress,
        network: "arbitrumSepolia",
        deployer: admin,
        deployedAt: new Date().toISOString(),
      },
      null,
      2
    )
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### Step 2: Configure Hardhat

Update `hardhat.config.ts`:

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    arbitrumSepolia: {
      url: process.env.ARBITRUM_SEPOLIA_RPC_URL || "https://sepolia-rollup.arbitrum.io/rpc",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      arbitrumSepolia: process.env.ARBISCAN_API_KEY || "",
    },
  },
};

export default config;
```

### Step 3: Set Environment Variables

Create `.env` file in project root:

```env
# Private key (NEVER commit this!)
PRIVATE_KEY=0x...  # Your wallet private key

# RPC endpoints
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc

# Verification
ARBISCAN_API_KEY=...  # Get from https://arbiscan.io/apis
```

### Step 4: Deploy

```bash
# Install dependencies (if not already)
npx hardhat

# Deploy to Arbitrum Sepolia
npx hardhat run scripts/deploy-erc721-v3.ts --network arbitrumSepolia
```

**Output:**
```
Deploying CertificateNFT to Arbitrum Sepolia...
✅ CertificateNFT deployed to: 0x1234...abcd
✅ Admin set to: 0x5678...xyz
```

### Step 5: Verify on Block Explorer

```bash
# Verify contract on Arbiscan (optional but recommended)
npx hardhat verify --network arbitrumSepolia [CONTRACT_ADDRESS]
```

---

## 💻 Option 3: Using Forge/Cast (Advanced)

**Best for:** Advanced users and CI/CD

### Step 1: Setup Forge

```bash
# Install Foundry (if not already)
curl -L https://foundry.paradigm.xyz | bash
~/.foundry/bin/foundryup

# Initialize project (if using Foundry)
forge init
```

### Step 2: Copy Contract

Copy `CertificateNFT.sol` to `src/CertificateNFT.sol`

### Step 3: Deploy with Cast

```bash
# Set environment
export ARBITRUM_SEPOLIA_RPC=https://sepolia-rollup.arbitrum.io/rpc
export PRIVATE_KEY=0x...

# Deploy
forge create src/CertificateNFT.sol:CertificateNFT \
  --rpc-url $ARBITRUM_SEPOLIA_RPC \
  --private-key $PRIVATE_KEY \
  --gas-price 100000000  # 0.1 gwei
```

---

## ✅ Post-Deployment Steps

### 1. Verify Contract is Working

```bash
# Using Arbitrum Sepolia block explorer
# Go to: https://sepolia.arbiscan.io/address/[YOUR_ADDRESS]

# Functions you should see:
# - issueCertificate
# - verifyCertificate
# - revokeCertificate
# - tokenURI
# - etc.
```

### 2. Test Basic Function (Write)

Using Remix or Hardhat:

```solidity
// Issue a test certificate
function testIssueCertificate() public {
    uint256 tokenId = contract.issueCertificate(
        0x742d35Cc6634C0532925a3b844Bc9e7595f42e8E,  // Test recipient
        "Test Student",
        "Web3 Basics",
        "A+",
        "Test University"
    );
    console.log("Issued Token ID:", tokenId);
}
```

### 3. Test Read Function (View)

```solidity
// Verify the certificate
function testVerify() public view {
    (address owner, uint256 timestamp, bool valid, bytes32 dataHash) = 
        contract.verifyCertificate(tokenId);
    
    console.log("Owner:", owner);
    console.log("Timestamp:", timestamp);
    console.log("Valid:", valid);
    console.log("Data Hash:", dataHash);
}
```

### 4. Update Frontend Environment

```env
# .env.local (apps/web/)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234...abcd  # Your deployed contract
NEXT_PUBLIC_CHAIN_ID=421614  # Arbitrum Sepolia
```

### 5. Test Frontend Integration

```bash
cd apps/web
npm run dev

# Visit http://localhost:3000
# Test: Issue a certificate
# Expected: Random 8-digit token ID
```

---

## 🔍 Verification & Testing

### Verify on Arbiscan

1. Go to https://sepolia.arbiscan.io
2. Search your contract address
3. Should show:
   - ✅ Contract code displayed
   - ✅ All functions listed
   - ✅ Events available
   - ✅ Can interact via "Read Contract" / "Write Contract"

### Test Issue Certificate (On Block Explorer)

1. Click "Write Contract"
2. Connect MetaMask wallet (must be admin)
3. Find `issueCertificate` function
4. Fill parameters:
   - `recipient`: 0x742d35Cc6634C0532925a3b844Bc9e7595f42e8E
   - `studentName`: Test Student
   - `courseName`: Web3 Basics
   - `grade`: A+
   - `institution`: Test University
5. Click "Write"
6. Confirm in MetaMask
7. Get transaction hash
8. Wait ~1 minute
9. Check transaction status - should be "Success"
10. View token ID emitted in the event

### Test Verify Certificate (On Block Explorer)

1. Click "Read Contract"
2. Find `verifyCertificate` function
3. Enter the token ID you just created
4. Should return:
   - `owner`: Your address
   - `timestamp`: Current block time
   - `valid`: true
   - `dataHash`: The hash of certificate data

---

## 🧪 Full Integration Test

### Test Scenario 1: Issue → Verify → Revoke

```typescript
// Step 1: Issue a certificate
const txIssue = await contract.issueCertificate(
  recipientAddress,
  "John Doe",
  "Blockchain 101",
  "A+",
  "Stanford"
);
const receipt = await txIssue.wait();
const tokenId = receipt.logs[0].topics[1];  // Get from event
console.log("Issued:", tokenId);  // Should be 8-digit number

// Step 2: Verify the certificate
const [owner, timestamp, valid, hash] = await contract.verifyCertificate(tokenId);
console.log("Valid:", valid);  // Should be true

// Step 3: Verify the data
const isAuth = await contract.verifyCertificateData(
  tokenId,
  recipientAddress,
  "John Doe",
  "Blockchain 101",
  "A+",
  "Stanford"
);
console.log("Authentic:", isAuth);  // Should be true

// Step 4: Revoke
const txRevoke = await contract.revokeCertificate(tokenId);
await txRevoke.wait();

// Step 5: Verify again
const [owner2, timestamp2, valid2, hash2] = await contract.verifyCertificate(tokenId);
console.log("Valid after revoke:", valid2);  // Should be false
```

---

## 📊 Gas Cost Estimation

### Deploy Cost
- Gas limit: 120,000
- Gas price on Arbitrum Sepolia: ~0.1 gwei (very cheap!)
- Estimated cost: 0.000012 ETH (~$0.05 at $4000/ETH)

### Per Transaction

| Operation | Gas | Cost |
|-----------|-----|------|
| Issue Certificate | 45,000 | 0.0000045 ETH |
| Verify (read) | 2,000 | Free |
| Revoke | 30,000 | 0.000003 ETH |
| Data Verify | 3,000 | Free |

**Total for 100 issues:** 0.00045 ETH (~$2 at $4000/ETH)

---

## 🐛 Troubleshooting

### Error: "Constructor takes no parameters but X arguments provided"

**Problem:** You're trying to pass parameters to the constructor.

**Solution:** The new contract has no constructor parameters:
```solidity
constructor()  // No parameters!
    // admin = msg.sender (automatic)
```

### Error: "Function not found: issue_certificate"

**Problem:** Using old function name (snake_case).

**Solution:** Use new camelCase names:
```solidity
// Wrong
contract.issue_certificate(...)

// Correct
contract.issueCertificate(...)
```

### Error: "reverted: Insufficient balance"

**Problem:** Wallet doesn't have enough ETH for gas.

**Solution:** Get free Arbitrum Sepolia ETH:
```
https://faucet.quicknode.com/arbitrum/sepolia
https://faucetbot.xyz/
```

### Error: "No matching overload found"

**Problem:** Function call parameters don't match ABI.

**Solution:** Verify parameter order and types match contract function signature.

---

## 📋 Deployment Checklist

- [ ] Contract code verified (CertificateNFT.sol)
- [ ] Solidity compiler set to 0.8.20
- [ ] Contract compiles without errors
- [ ] Wallet has Arbitrum Sepolia ETH
- [ ] Environment variables configured (.env)
- [ ] Private key secured (never commit!)
- [ ] Deploy script ready (if using Hardhat)
- [ ] Contract deployed successfully
- [ ] Deployment address saved
- [ ] Contract verified on Arbiscan
- [ ] Test functions work (issue, verify, revoke)
- [ ] Frontend environment variables updated
- [ ] Frontend tests pass
- [ ] Wallet integration tested
- [ ] Ready for production

---

## 🎯 What's Next

1. **Deploy** the contract to Arbitrum Sepolia
2. **Test** all functions on the deployed contract
3. **Update** frontend with new contract address
4. **Test** end-to-end on the frontend
5. **Deploy** to production when verified
6. **Monitor** contract for issues

---

## 📞 Support Resources

- **Remix IDE:** https://remix.ethereum.org
- **Hardhat Docs:** https://hardhat.org/getting-started
- **Arbitrum Docs:** https://docs.arbitrum.io
- **Arbiscan:** https://sepolia.arbiscan.io
- **Testnet Faucet:** https://faucetbot.xyz/

Your optimized contract is production-ready! Deploy with confidence. 🚀
