const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

/**
 * Backup/Export Script for ChainCheck Data
 * 
 * Exports contract data to JSON files for backup and analysis
 * 
 * Usage:
 *   npx hardhat run scripts/backup-data.js --network polygon
 */

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

async function main() {
  console.log("\n" + "=".repeat(60));
  console.log("  ChainCheck Data Backup/Export");
  console.log("=".repeat(60) + "\n");

  if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    console.error("[ERROR] CONTRACT_ADDRESS not set in .env");
    process.exit(1);
  }

  const ChainCheck = await ethers.getContractFactory("ChainCheck");
  const contract = ChainCheck.attach(CONTRACT_ADDRESS);

  const backupDir = path.join(__dirname, "..", "backups");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = path.join(backupDir, `backup-${timestamp}.json`);

  const backup = {
    timestamp: new Date().toISOString(),
    network: hre.network.name,
    contractAddress: CONTRACT_ADDRESS,
    data: {},
  };

  console.log("Exporting contract data...\n");

  // Get owner
  try {
    const owner = await contract.owner();
    backup.data.owner = owner;
    console.log("[OK] Owner:", owner);
  } catch (e) {
    console.log("[WARN] Could not get owner:", e.message);
  }

  // Get authorized manufacturers
  try {
    const eventFilter = contract.filters.ManufacturerAuthorized();
    const events = await contract.queryFilter(eventFilter);
    const manufacturers = events.map((e) => e.args.manufacturer);
    backup.data.authorizedManufacturers = manufacturers;
    console.log(`[OK] Found ${manufacturers.length} authorized manufacturers`);
  } catch (e) {
    console.log("[WARN] Could not get manufacturers:", e.message);
  }

  // Get all product batches (limited to recent events)
  try {
    const batchFilter = contract.filters.ProductBatchRegistered();
    const events = await contract.queryFilter(batchFilter, -10000); // Last 10000 blocks
    const batches = events.map((e) => ({
      batchId: Number(e.args.batchId),
      name: e.args.name,
      brand: e.args.brand,
      manufacturer: e.args.manufacturer,
      blockNumber: e.blockNumber,
      transactionHash: e.transactionHash,
    }));
    backup.data.productBatches = batches;
    console.log(`[OK] Found ${batches.length} product batches`);
  } catch (e) {
    console.log("[WARN] Could not get product batches:", e.message);
  }

  // Get verification statistics
  try {
    const verifyFilter = contract.filters.ProductVerified();
    const events = await contract.queryFilter(verifyFilter, -10000);
    const verifications = events.map((e) => ({
      serialHash: e.args.serialHash,
      batchId: Number(e.args.batchId),
      verifier: e.args.verifier,
      isAuthentic: e.args.isAuthentic,
      blockNumber: e.blockNumber,
      transactionHash: e.transactionHash,
    }));
    backup.data.verifications = verifications;
    console.log(`[OK] Found ${verifications.length} verifications`);
  } catch (e) {
    console.log("[WARN] Could not get verifications:", e.message);
  }

  // Save backup
  fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
  console.log(`\n[OK] Backup saved to: ${backupFile}`);
  console.log(`\nBackup Summary:`);
  console.log(`  - Manufacturers: ${backup.data.authorizedManufacturers?.length || 0}`);
  console.log(`  - Product Batches: ${backup.data.productBatches?.length || 0}`);
  console.log(`  - Verifications: ${backup.data.verifications?.length || 0}`);
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

