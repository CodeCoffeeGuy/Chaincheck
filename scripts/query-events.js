const { ethers } = require("hardhat");
require("dotenv").config();

/**
 * Query Events Script
 * 
 * Query historical events from the ChainCheck contract
 * 
 * Usage:
 *   npx hardhat run scripts/query-events.js --network localhost
 *   npx hardhat run scripts/query-events.js --network mumbai
 * 
 * Options:
 *   --from-block <number>  Start from block number (default: 0)
 *   --to-block <number>    End at block number (default: latest)
 *   --event <name>         Filter by event name (ProductRegistered, Verified, ManufacturerAuthorized)
 */

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Parse command line arguments
const args = process.argv.slice(2);
let fromBlock = 0;
let toBlock = "latest";
let eventFilter = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--from-block" && args[i + 1]) {
    fromBlock = parseInt(args[i + 1]);
    i++;
  } else if (args[i] === "--to-block" && args[i + 1]) {
    toBlock = args[i + 1] === "latest" ? "latest" : parseInt(args[i + 1]);
    i++;
  } else if (args[i] === "--event" && args[i + 1]) {
    eventFilter = args[i + 1];
    i++;
  }
}

async function main() {
  console.log("\n=== ChainCheck Event Query ===\n");
  console.log("Contract Address:", CONTRACT_ADDRESS);
  console.log("From Block:", fromBlock);
  console.log("To Block:", toBlock === "latest" ? "latest" : toBlock);
  if (eventFilter) {
    console.log("Event Filter:", eventFilter);
  }
  console.log("");

  // Get contract instance
  const ChainCheck = await ethers.getContractFactory("ChainCheck");
  const contract = ChainCheck.attach(CONTRACT_ADDRESS);

  // Query ProductRegistered events
  if (!eventFilter || eventFilter === "ProductRegistered") {
    console.log("ProductRegistered Events:");
    const productEvents = await contract.queryFilter(
      contract.filters.ProductRegistered(),
      fromBlock,
      toBlock
    );

    if (productEvents.length === 0) {
      console.log("  (none found)\n");
    } else {
      for (const event of productEvents) {
        const args = event.args;
        console.log(`  Batch ID: ${args.batchId.toString()}`);
        console.log(`  Name: ${args.name}`);
        console.log(`  Brand: ${args.brand}`);
        console.log(`  Serial Count: ${args.serialCount.toString()}`);
        console.log(`  Block: ${event.blockNumber}`);
        console.log(`  Transaction: ${event.transactionHash}`);
        console.log("");
      }
    }
  }

  // Query Verified events
  if (!eventFilter || eventFilter === "Verified") {
    console.log("Verified Events:");
    const verifiedEvents = await contract.queryFilter(
      contract.filters.Verified(),
      fromBlock,
      toBlock
    );

    if (verifiedEvents.length === 0) {
      console.log("  (none found)\n");
    } else {
      let authenticCount = 0;
      let fakeCount = 0;

      for (const event of verifiedEvents) {
        const args = event.args;
        const status = args.isAuthentic ? "AUTHENTIC" : "COUNTERFEIT";
        if (args.isAuthentic) authenticCount++;
        else fakeCount++;

        console.log(`  Status: ${status}`);
        console.log(`  Serial Hash: ${args.serialHash}`);
        console.log(`  Batch ID: ${args.batchId.toString()}`);
        console.log(`  Verifier: ${args.verifier}`);
        console.log(`  Block: ${event.blockNumber}`);
        console.log(`  Transaction: ${event.transactionHash}`);
        console.log("");
      }

      console.log(`  Summary: ${authenticCount} authentic, ${fakeCount} potential counterfeits\n`);
    }
  }

  // Query ManufacturerAuthorized events
  if (!eventFilter || eventFilter === "ManufacturerAuthorized") {
    console.log("ManufacturerAuthorized Events:");
    const authEvents = await contract.queryFilter(
      contract.filters.ManufacturerAuthorized(),
      fromBlock,
      toBlock
    );

    if (authEvents.length === 0) {
      console.log("  (none found)\n");
    } else {
      for (const event of authEvents) {
        const args = event.args;
        const action = args.authorized ? "Authorized" : "Revoked";
        console.log(`  Manufacturer: ${args.maker}`);
        console.log(`  Action: ${action}`);
        console.log(`  Block: ${event.blockNumber}`);
        console.log(`  Transaction: ${event.transactionHash}`);
        console.log("");
      }
    }
  }

  console.log("Event query complete!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n=== Error ===");
    console.error(error);
    process.exitCode = 1;
  });

