const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying CertificateNFT contract...\n");

  // Get the contract factory
  const CertificateNFT = await hre.ethers.getContractFactory("CertificateNFT");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Deploying with account:", deployer.address);

  // Deploy contract with admin address (you can change this)
  const adminAddress = process.env.ADMIN_ADDRESS || deployer.address;
  console.log("👤 Admin address set to:", adminAddress);
  console.log("");

  const certificateNFT = await CertificateNFT.deploy(adminAddress);
  await certificateNFT.deployed();

  console.log("✅ Contract deployed successfully!");
  console.log("📜 Contract Address:", certificateNFT.address);
  console.log("");

  // Display network info
  const network = await hre.ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name);
  console.log("🔗 Chain ID:", network.chainId);
  console.log("");

  // Save deployment info
  const deploymentInfo = {
    contractAddress: certificateNFT.address,
    adminAddress: adminAddress,
    deployerAddress: deployer.address,
    network: network.name,
    chainId: network.chainId,
    deploymentDate: new Date().toISOString(),
    blockExplorerUrl: getBlockExplorerUrl(network.chainId, certificateNFT.address),
  };

  console.log("📊 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  console.log("");

  // Verify initial state
  console.log("🔍 Verifying initial state...");
  const currentAdmin = await certificateNFT.getAdmin();
  const totalSupply = await certificateNFT.totalSupply();

  console.log("   Admin:", currentAdmin);
  console.log("   Total Supply:", totalSupply.toString());
  console.log("");

  console.log("💡 Next steps:");
  console.log("   1. Update your .env file with the contract address");
  console.log("   2. Verify the contract on block explorer (if desired)");
  console.log("   3. Connect your frontend to interact with the contract");
  console.log("");

  // Option to verify on block explorer
  if (network.chainId === 421614) {
    console.log("🔗 To verify on Arbiscan, run:");
    console.log(
      `   npx hardhat verify --network arbitrumSepolia ${certificateNFT.address} "${adminAddress}"`
    );
  }
}

function getBlockExplorerUrl(chainId, address) {
  const explorers = {
    1: `https://etherscan.io/address/${address}`,
    11155111: `https://sepolia.etherscan.io/address/${address}`,
    42161: `https://arbiscan.io/address/${address}`,
    421614: `https://sepolia.arbiscan.io/address/${address}`,
  };
  return explorers[chainId] || "Unknown network";
}

main().catch((error) => {
  console.error("❌ Deployment failed:");
  console.error(error);
  process.exitCode = 1;
});
