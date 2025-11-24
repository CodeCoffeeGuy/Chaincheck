const hre = require("hardhat");
require("dotenv").config();

/**
 * Authorize a manufacturer address
 * 
 * Usage:
 *   npx hardhat run scripts/authorize-manufacturer.js --network amoy
 * 
 * Or with specific address:
 *   MANUFACTURER_ADDRESS=0x... npx hardhat run scripts/authorize-manufacturer.js --network amoy
 */

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Authorizing manufacturer with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Get contract address from config or environment
  const contractAddress = process.env.CONTRACT_ADDRESS || "0x86b462f596452E0E66b3A246dFB8e76e89f2eD6D";
  console.log("\nContract address:", contractAddress);

  // Get manufacturer address to authorize
  const manufacturerAddress = process.env.MANUFACTURER_ADDRESS || deployer.address;
  console.log("Manufacturer address to authorize:", manufacturerAddress);

  // Load contract
  const ChainCheck = await hre.ethers.getContractFactory("ChainCheck");
  const chaincheck = await ChainCheck.attach(contractAddress);

  // Check if deployer is owner
  const owner = await chaincheck.owner();
  console.log("\nContract owner:", owner);
  
  if (owner.toLowerCase() !== deployer.address.toLowerCase()) {
    console.error("\n[ERROR] Deployer is not the contract owner!");
    console.error("   Only the owner can authorize manufacturers.");
    console.error("   Owner address:", owner);
    console.error("   Your address:", deployer.address);
    process.exit(1);
  }

  // Check if already authorized
  const isAuthorized = await chaincheck.authorizedMakers(manufacturerAddress);
  if (isAuthorized) {
    console.log("\n[INFO] Manufacturer is already authorized!");
    process.exit(0);
  }

  // Authorize manufacturer
  console.log("\nAuthorizing manufacturer...");
  const tx = await chaincheck.authorizeManufacturer(manufacturerAddress, true);
  console.log("Transaction hash:", tx.hash);
  
  console.log("Waiting for confirmation...");
  const receipt = await tx.wait();
  
  console.log("\n[SUCCESS] Manufacturer authorized!");
  console.log("   Address:", manufacturerAddress);
  console.log("   Block:", receipt.blockNumber);
  console.log("   Gas used:", receipt.gasUsed.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });




