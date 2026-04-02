#!/bin/bash

# Deployment script for CertificateNFT on Arbitrum Sepolia
# Prerequisites: 
#   - Hardhat installed
#   - .env file with PRIVATE_KEY and ARBITRUM_SEPOLIA_RPC_URL
#   - Sufficient ETH in deployer wallet for gas

set -e

echo "🚀 Deploying CertificateNFT contract..."

# Admin address - replace with your institution's admin wallet
ADMIN_ADDRESS="0x742d35Cc6634C0532925a3b844Bc9e7595f42cB6"

echo "📋 Configuration:"
echo "   Admin Address: $ADMIN_ADDRESS"
echo "   Network: Arbitrum Sepolia"
echo ""

# Deploy using hardhat
# npx hardhat run scripts/deploy-solidity.sh --network arbitrumSepolia

echo "✅ Deployment script ready!"
echo ""
echo "To deploy with Hardhat:"
echo "  npx hardhat run scripts/deploy-certificate.js --network arbitrumSepolia"
echo ""
echo "To deploy with Truffle:"
echo "  truffle migrate --network arbitrumSepolia"
echo ""
echo "To deploy manually on Remix IDE:"
echo "  1. Go to https://remix.ethereum.org"
echo "  2. Copy CertificateNFT.sol code"
echo "  3. Compile with Solidity 0.8.19+"
echo "  4. Deploy with initialAdmin: $ADMIN_ADDRESS"
