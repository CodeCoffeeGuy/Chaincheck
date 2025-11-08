const { ethers } = require("hardhat");
require("dotenv").config();

/**
 * Pause/Unpause Contract Script
 * 
 * Emergency stop functionality for the ChainCheck contract
 * 
 * Usage:
 *   npx hardhat run scripts/pause-contract.js --network localhost
 *   npx hardhat run scripts/pause-contract.js --network mumbai --pause
 *   npx hardhat run scripts/pause-contract.js --network mumbai --unpause
 */

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Parse command line arguments
const args = process.argv.slice(2);
const shouldPause = args.includes("--pause");
const shouldUnpause = args.includes("--unpause");

async function main() {
  console.log("\n=== ChainCheck Pause/Unpause ===\n");
  console.log("Contract Address:", CONTRACT_ADDRESS);
  console.log("");

  // Get signer
  const [signer] = await ethers.getSigners();
  console.log("Signer address:", signer.address);

  // Get contract instance
  const ChainCheck = await ethers.getContractFactory("ChainCheck");
  const contract = ChainCheck.attach(CONTRACT_ADDRESS);

  // Check if signer is owner
  const owner = await contract.owner();
  if (signer.address.toLowerCase() !== owner.toLowerCase()) {
    throw new Error("Only contract owner can pause/unpause");
  }

  // Check current pause state
  const isPaused = await contract.paused();
  console.log("Current pause state:", isPaused ? "PAUSED" : "ACTIVE");
  console.log("");

  // Determine action
  let action;
  if (shouldPause) {
    if (isPaused) {
      console.log("WARNING: Contract is already paused. No action needed.");
      return;
    }
    action = "pause";
  } else if (shouldUnpause) {
    if (!isPaused) {
      console.log("WARNING: Contract is already active. No action needed.");
      return;
    }
    action = "unpause";
  } else {
    // Interactive mode - ask user
    console.log("No action specified. Use --pause or --unpause flag.");
    console.log("Current state:", isPaused ? "PAUSED" : "ACTIVE");
    console.log("\nTo pause:   npx hardhat run scripts/pause-contract.js --network <network> --pause");
    console.log("To unpause: npx hardhat run scripts/pause-contract.js --network <network> --unpause");
    return;
  }

  // Execute pause/unpause
  console.log(`Executing ${action}...`);
  
  let tx;
  if (action === "pause") {
    tx = await contract.pause();
    console.log("Transaction hash:", tx.hash);
    console.log("Waiting for confirmation...");
  } else {
    tx = await contract.unpause();
    console.log("Transaction hash:", tx.hash);
    console.log("Waiting for confirmation...");
  }

  const receipt = await tx.wait();
  console.log("Transaction confirmed!");
  console.log("Gas used:", receipt.gasUsed.toString());
  console.log("");

  // Verify new state
  const newState = await contract.paused();
  console.log("New pause state:", newState ? "PAUSED" : "ACTIVE");
  console.log("");

  if (newState) {
    console.log("WARNING: Contract is now PAUSED");
    console.log("   - Product registration is disabled");
    console.log("   - Product verification is disabled");
    console.log("   - Owner functions still work");
  } else {
    console.log("Contract is now ACTIVE");
    console.log("   - All functions are operational");
  }
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n=== Error ===");
    console.error(error);
    process.exitCode = 1;
  });

