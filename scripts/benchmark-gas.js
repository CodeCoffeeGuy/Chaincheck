const hre = require("hardhat");
require("dotenv").config();

/**
 * Gas Benchmarking Script
 * 
 * Measures gas costs for all contract functions to help with optimization
 * 
 * Usage:
 *   npx hardhat run scripts/benchmark-gas.js --network localhost
 */

async function main() {
  console.log("\n" + "=".repeat(60));
  console.log("  ChainCheck Gas Benchmarking");
  console.log("=".repeat(60) + "\n");

  const [deployer, manufacturer, verifier] = await ethers.getSigners();
  const ChainCheck = await ethers.getContractFactory("ChainCheck");
  const contract = await ChainCheck.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("Contract deployed at:", contractAddress);
  console.log("");

  // Authorize manufacturer
  console.log("Authorizing manufacturer...");
  const authTx = await contract.authorizeManufacturer(manufacturer.address);
  await authTx.wait();
  console.log("[OK] Manufacturer authorized\n");

  const results = [];

  // Benchmark: Register Product Batch
  console.log("Benchmarking: registerProductBatch...");
  const registerTx = await contract.connect(manufacturer).registerProductBatch(
    1,
    "Test Product",
    "Test Brand",
    [ethers.keccak256(ethers.toUtf8Bytes("SN001"))],
    { gasLimit: 5000000 }
  );
  const registerReceipt = await registerTx.wait();
  const registerGas = registerReceipt.gasUsed;
  results.push({ function: "registerProductBatch", gas: registerGas.toString() });
  console.log(`  Gas used: ${registerGas.toString()}\n`);

  // Benchmark: Verify Product
  console.log("Benchmarking: verifyProduct...");
  const serialHash = ethers.keccak256(ethers.AbiCoder.defaultAbiCoder().encode(
    ["uint256", "string"],
    [1, "SN001"]
  ));
  const verifyTx = await contract.connect(verifier).verifyProduct(serialHash, 1, { gasLimit: 5000000 });
  const verifyReceipt = await verifyTx.wait();
  const verifyGas = verifyReceipt.gasUsed;
  results.push({ function: "verifyProduct", gas: verifyGas.toString() });
  console.log(`  Gas used: ${verifyGas.toString()}\n`);

  // Benchmark: Get Product Info (view function - no gas, but we measure)
  console.log("Benchmarking: getProductInfo (view function)...");
  const productInfo = await contract.getProductInfo(1);
  results.push({ function: "getProductInfo", gas: "0 (view)" });
  console.log("  Gas used: 0 (view function)\n");

  // Benchmark: Get Verification Count (view function)
  console.log("Benchmarking: getVerificationCount (view function)...");
  const count = await contract.getVerificationCount(serialHash);
  results.push({ function: "getVerificationCount", gas: "0 (view)" });
  console.log("  Gas used: 0 (view function)\n");

  // Benchmark: Batch Register (multiple serials)
  console.log("Benchmarking: registerProductBatch (5 serials)...");
  const batchSerials = Array.from({ length: 5 }, (_, i) => 
    ethers.keccak256(ethers.toUtf8Bytes(`SN00${i + 2}`))
  );
  const batchTx = await contract.connect(manufacturer).registerProductBatch(
    2,
    "Batch Product",
    "Batch Brand",
    batchSerials,
    { gasLimit: 5000000 }
  );
  const batchReceipt = await batchTx.wait();
  const batchGas = batchReceipt.gasUsed;
  results.push({ function: "registerProductBatch (5 serials)", gas: batchGas.toString() });
  console.log(`  Gas used: ${batchGas.toString()}\n`);

  // Summary
  console.log("=".repeat(60));
  console.log("  Gas Benchmark Results");
  console.log("=".repeat(60) + "\n");
  console.log("Function".padEnd(40) + "Gas Used");
  console.log("-".repeat(60));
  results.forEach(({ function: func, gas }) => {
    console.log(func.padEnd(40) + gas);
  });
  console.log("\n" + "=".repeat(60));
  console.log("\nNote: Gas costs vary by network and current gas prices.");
  console.log("View functions (reads) cost 0 gas for users.\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

