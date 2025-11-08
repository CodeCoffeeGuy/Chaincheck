const { ethers } = require("hardhat");
require("dotenv").config();

/**
 * Event Listener Script
 * 
 * Monitors ChainCheck contract events in real-time
 * 
 * Usage:
 *   npx hardhat run scripts/listen-events.js --network localhost
 *   npx hardhat run scripts/listen-events.js --network mumbai
 */

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function main() {
  console.log("\n=== ChainCheck Event Listener ===\n");
  console.log("Contract Address:", CONTRACT_ADDRESS);
  console.log("Listening for events...\n");

  // Get contract instance
  const ChainCheck = await ethers.getContractFactory("ChainCheck");
  const contract = ChainCheck.attach(CONTRACT_ADDRESS);

  // Listen for ProductRegistered events
  contract.on("ProductRegistered", (batchId, name, brand, serialCount, event) => {
    console.log("Product Registered:");
    console.log("  Batch ID:", batchId.toString());
    console.log("  Name:", name);
    console.log("  Brand:", brand);
    console.log("  Serial Count:", serialCount.toString());
    console.log("  Block:", event.log.blockNumber);
    console.log("  Transaction:", event.log.transactionHash);
    console.log("");
  });

  // Listen for Verified events
  contract.on("Verified", (serialHash, batchId, isAuthentic, verifier, event) => {
    const status = isAuthentic ? "AUTHENTIC" : "POTENTIAL COUNTERFEIT";
    console.log("Product Verified:");
    console.log("  Status:", status);
    console.log("  Serial Hash:", serialHash);
    console.log("  Batch ID:", batchId.toString());
    console.log("  Verifier:", verifier);
    console.log("  Block:", event.log.blockNumber);
    console.log("  Transaction:", event.log.transactionHash);
    console.log("");
  });

  // Listen for ManufacturerAuthorized events
  contract.on("ManufacturerAuthorized", (maker, authorized, event) => {
    const action = authorized ? "Authorized" : "Revoked";
    console.log("Manufacturer Authorization:");
    console.log("  Manufacturer:", maker);
    console.log("  Action:", action);
    console.log("  Block:", event.log.blockNumber);
    console.log("  Transaction:", event.log.transactionHash);
    console.log("");
  });

  console.log("Event listeners active. Press Ctrl+C to stop.\n");
}

main()
  .then(() => {
    // Keep process alive
    process.stdin.resume();
  })
  .catch((error) => {
    console.error("\n=== Error ===");
    console.error(error);
    process.exitCode = 1;
  });

