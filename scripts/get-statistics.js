const { ethers } = require("hardhat");
require("dotenv").config();

/**
 * Statistics Script
 * 
 * Get comprehensive statistics from the ChainCheck contract
 * 
 * Usage:
 *   npx hardhat run scripts/get-statistics.js --network localhost
 *   npx hardhat run scripts/get-statistics.js --network mumbai
 */

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function main() {
  console.log("\n=== ChainCheck Statistics ===\n");
  console.log("Contract Address:", CONTRACT_ADDRESS);
  console.log("");

  // Get contract instance
  const ChainCheck = await ethers.getContractFactory("ChainCheck");
  const contract = ChainCheck.attach(CONTRACT_ADDRESS);

  // Get owner
  const owner = await contract.owner();
  console.log("Contract Owner:", owner);

  // Get statistics
  const stats = await contract.getStatistics();
  console.log("\nContract Statistics:");
  console.log("  Total Products:", stats.totalProductsCount.toString());
  console.log("  Total Verifications:", stats.totalVerificationsCount.toString());
  console.log("  Total Manufacturers:", stats.totalManufacturers.toString());

  // Get all manufacturers
  const manufacturers = await contract.getManufacturers();
  console.log("\nAuthorized Manufacturers:");
  if (manufacturers.length === 0) {
    console.log("  (none)");
  } else {
    manufacturers.forEach((addr, index) => {
      console.log(`  ${index + 1}. ${addr}`);
    });
  }

  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log("\nNetwork Info:");
  console.log("  Name:", network.name);
  console.log("  Chain ID:", network.chainId.toString());

  // Get block info
  const blockNumber = await ethers.provider.getBlockNumber();
  const block = await ethers.provider.getBlock(blockNumber);
  console.log("\nLatest Block:");
  console.log("  Number:", blockNumber);
  console.log("  Timestamp:", new Date(Number(block.timestamp) * 1000).toISOString());

  console.log("\nStatistics retrieved successfully!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n=== Error ===");
    console.error(error);
    process.exitCode = 1;
  });

