const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

/**
 * Contract Migration Script
 * 
 * Since ChainCheck is not upgradeable, this script helps migrate data
 * from an old contract to a new contract if you need to deploy a new version.
 * 
 * IMPORTANT: This is a data migration script, not an upgrade.
 * The old contract remains immutable on-chain.
 * 
 * Usage:
 *   npx hardhat run scripts/migrate-to-new-contract.js --network polygon
 * 
 * Prerequisites:
 *   - OLD_CONTRACT_ADDRESS set in .env (old contract)
 *   - NEW_CONTRACT_ADDRESS set in .env (new contract)
 *   - PRIVATE_KEY set in .env
 */

const OLD_CONTRACT_ADDRESS = process.env.OLD_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS;
const NEW_CONTRACT_ADDRESS = process.env.NEW_CONTRACT_ADDRESS;

async function main() {
  console.log("\n" + "=".repeat(60));
  console.log("  ChainCheck Contract Migration Script");
  console.log("=".repeat(60) + "\n");

  if (!OLD_CONTRACT_ADDRESS || OLD_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    console.error("[ERROR] OLD_CONTRACT_ADDRESS not set in .env");
    process.exit(1);
  }

  if (!NEW_CONTRACT_ADDRESS || NEW_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    console.error("[ERROR] NEW_CONTRACT_ADDRESS not set in .env");
    console.error("   Deploy new contract first, then set NEW_CONTRACT_ADDRESS");
    process.exit(1);
  }

  const [deployer] = await ethers.getSigners();
  console.log("Migrator Address:", deployer.address);
  console.log("Old Contract:", OLD_CONTRACT_ADDRESS);
  console.log("New Contract:", NEW_CONTRACT_ADDRESS);
  console.log("");

  // Get contract instances
  const ChainCheck = await ethers.getContractFactory("ChainCheck");
  const oldContract = ChainCheck.attach(OLD_CONTRACT_ADDRESS);
  const newContract = ChainCheck.attach(NEW_CONTRACT_ADDRESS);

  // Verify contracts exist
  try {
    await oldContract.owner();
    await newContract.owner();
  } catch (error) {
    console.error("[ERROR] Could not connect to contracts");
    console.error("   Make sure both contracts are deployed and addresses are correct");
    process.exit(1);
  }

  console.log("✅ Both contracts are accessible\n");

  // Get data from old contract
  console.log("📥 Reading data from old contract...");
  
  const stats = await oldContract.getStatistics();
  console.log("   Total Products:", stats.totalProductsCount.toString());
  console.log("   Total Verifications:", stats.totalVerificationsCount.toString());
  console.log("   Total Manufacturers:", stats.totalManufacturers.toString());
  console.log("");

  const manufacturers = await oldContract.getManufacturers();
  console.log("📋 Found", manufacturers.length, "manufacturers");

  // Check if deployer is authorized in new contract
  const isAuthorized = await newContract.authorizedMakers(deployer.address);
  if (!isAuthorized) {
    console.error("[ERROR] Deployer is not authorized in new contract");
    console.error("   Authorize yourself first in the new contract");
    process.exit(1);
  }

  console.log("✅ Deployer is authorized in new contract\n");

  // Migration plan
  console.log("=".repeat(60));
  console.log("  Migration Plan");
  console.log("=".repeat(60));
  console.log("");
  console.log("⚠️  IMPORTANT NOTES:");
  console.log("   1. This script migrates MANUFACTURER AUTHORIZATIONS only");
  console.log("   2. Product data CANNOT be migrated (immutable on old contract)");
  console.log("   3. Verification history CANNOT be migrated");
  console.log("   4. You'll need to re-register products in the new contract");
  console.log("");
  console.log("What WILL be migrated:");
  console.log("   ✅ Manufacturer authorizations");
  console.log("");
  console.log("What CANNOT be migrated:");
  console.log("   ❌ Product batches (must re-register)");
  console.log("   ❌ Verification history");
  console.log("   ❌ Serial number mappings");
  console.log("");

  // Ask for confirmation
  console.log("Do you want to proceed with manufacturer migration?");
  console.log("(This script will authorize all manufacturers from old contract in new contract)");
  console.log("");
  console.log("⚠️  This will cost gas for each authorization!");
  console.log("");

  // In automated mode, we'll proceed (for script usage)
  // In interactive mode, you'd ask for confirmation here

  // Migrate manufacturers
  console.log("🔄 Migrating manufacturers...");
  let migrated = 0;
  let failed = 0;

  for (const manufacturer of manufacturers) {
    try {
      const isAuth = await newContract.authorizedMakers(manufacturer);
      if (!isAuth) {
        console.log(`   Authorizing: ${manufacturer}...`);
        const tx = await newContract.authorizeManufacturer(manufacturer, true);
        await tx.wait();
        migrated++;
        console.log(`   ✅ Authorized: ${manufacturer}`);
      } else {
        console.log(`   ⏭️  Already authorized: ${manufacturer}`);
      }
    } catch (error) {
      console.error(`   ❌ Failed to authorize ${manufacturer}:`, error.message);
      failed++;
    }
  }

  console.log("");
  console.log("=".repeat(60));
  console.log("  Migration Summary");
  console.log("=".repeat(60));
  console.log("");
  console.log("✅ Migrated:", migrated, "manufacturers");
  if (failed > 0) {
    console.log("❌ Failed:", failed, "manufacturers");
  }
  console.log("");

  // Save migration report
  const migrationReport = {
    oldContract: OLD_CONTRACT_ADDRESS,
    newContract: NEW_CONTRACT_ADDRESS,
    migratedAt: new Date().toISOString(),
    manufacturersMigrated: migrated,
    manufacturersFailed: failed,
    note: "Product data and verification history cannot be migrated - must re-register products"
  };

  const reportPath = path.join(__dirname, "..", "migration-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(migrationReport, null, 2));
  console.log("📄 Migration report saved to: migration-report.json");
  console.log("");

  console.log("=".repeat(60));
  console.log("  Next Steps");
  console.log("=".repeat(60));
  console.log("");
  console.log("1. Update frontend configuration:");
  console.log("   Set VITE_CONTRACT_ADDRESS to:", NEW_CONTRACT_ADDRESS);
  console.log("");
  console.log("2. Re-register products:");
  console.log("   Manufacturers must re-register all products in the new contract");
  console.log("");
  console.log("3. Update documentation:");
  console.log("   Update contract address in README and other docs");
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n" + "=".repeat(60));
    console.error("  [ERROR] Migration Failed");
    console.error("=".repeat(60));
    console.error("\nError:", error.message);
    if (error.transaction) {
      console.error("\nTransaction:", error.transaction);
    }
    process.exitCode = 1;
  });




