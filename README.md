# NFT-Based Blockchain Certificate Verification System

A decentralized application (dApp) that issues and verifies academic certificates as NFTs on the blockchain - making them tamper-proof, instantly verifiable, and permanently owned by the recipient.

## Problem Statement

Traditional certificate systems face several critical challenges:
- **Forgery & Counterfeiting**: Certificates are easy to forge or alter
- **Loss & Damage**: Physical certificates can be lost, damaged, or destroyed
- **Verification Complexity**: Difficult and expensive to verify authenticity
- **Lack of Transparency**: Requires contacting institutions directly, creating bottlenecks
- **Poor Record Management**: Hard to maintain and access credentials over a lifetime

## Our Solution

We issue certificates as NFTs on the blockchain, ensuring authenticity, immutability, and transparent verification:

### How It Works
1. **Issuance**: Institutions mint certificates as unique ERC-721 NFTs with embedded metadata
2. **Ownership**: Students receive the NFT directly in their blockchain wallet
3. **Metadata**: Each NFT contains course details, grades, and issuance date
4. **Verification**: Employers verify instantly by scanning QR codes or checking the blockchain
5. **Immutability**: Once issued, certificates cannot be altered or counterfeited
6. **Decentralized**: No intermediaries needed - all verification is on-chain and public

### Key Benefits
- **Trust & Transparency**: Cryptographic proof of authenticity
- **Instant Verification**: No waiting for institution confirmation
- **Permanent Ownership**: Recipients own their credentials directly
- **Lifelong Accessibility**: Secure, portable, and always accessible
- **Zero Counterfeiting**: Blockchain immutability makes forgery impossible
- **Simplified Record Management**: All credentials in one digital wallet

## Project Structure

```
Blockchain-certificate/
├── apps/web/               # Next.js 14 Frontend
│   └── src/
│       ├── app/            # Pages (Issue, Verify, Dashboard)
│       ├── components/     # UI Components
│       ├── lib/            # Contract interaction utilities
│       └── types/          # TypeScript types
├── contracts/erc721/       # Rust/Stylus Smart Contract
│   └── src/lib.rs          # ERC-721 Certificate Contract
├── docs/                   # Documentation
├── scripts/                # Deployment scripts
└── README.md
```

## Smart Contract Features

| Function | Description |
|----------|-------------|
| issue_certificate() | Admin mints NFT certificate to student wallet |
| verify_certificate() | Anyone can verify a certificate using token ID |
| revoke_certificate() | Admin can revoke invalid certificates |
| balance_of() | Check how many certificates a wallet holds |
| owner_of_token() | Get owner of a specific certificate |
| total_supply() | Total certificates issued |

## Quick Start

### Prerequisites
- Node.js 18+
- Rust + Cargo
- pnpm

### Installation

```bash
git clone https://github.com/Taksh67/Blockchain-certificate
cd Blockchain-certificate
cd apps/web
pnpm install
cp .env.example .env
```

### Configure .env
```
PRIVATE_KEY=your_wallet_private_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_id
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_contract_address
```

### Deploy Contract
```bash
pnpm deploy:sepolia
pnpm deploy:mainnet
```

### Run Frontend
```bash
cd apps/web
pnpm dev
```

## Supported Networks

| Network | Type |
|---------|------|
| Arbitrum Sepolia | Testnet |
| Arbitrum One | Mainnet |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, Tailwind CSS |
| Web3 | wagmi, viem, RainbowKit |
| Smart Contract | Rust (Stylus), ERC-721 |
| Blockchain | Arbitrum (Layer 2) |

## Author

Taksh Padmani - Undergraduate CS Student
Project submitted for Semester 6
