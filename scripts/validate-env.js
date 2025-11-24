#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 * 
 * Validates that all required environment variables are set before deployment
 * 
 * Usage:
 *   node scripts/validate-env.js
 *   npm run validate-env
 */

require("dotenv").config();

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateEnv() {
  log("\n" + "=".repeat(60), "blue");
  log("  ChainCheck Environment Variable Validation", "blue");
  log("=".repeat(60) + "\n", "blue");

  const errors = [];
  const warnings = [];
  const required = [];
  const optional = [];

  // Determine which environment we're validating for
  const network = process.argv[2] || process.env.NETWORK || "all";
  const isProduction = process.env.NODE_ENV === "production";

  // Required for all deployments
  required.push({
    key: "PRIVATE_KEY",
    description: "Private key for contract deployment",
    validate: (value) => {
      if (!value) return "Missing";
      if (value.length < 64) return "Invalid format (too short)";
      const cleanValue = value.replace(/^0x/, "");
      if (!/^[0-9a-fA-F]{64}$/.test(cleanValue)) {
        return "Invalid format (must be 64 hex characters)";
      }
      return null;
    },
  });

  // Network-specific requirements
  if (network === "polygon" || network === "all") {
    required.push({
      key: "POLYGON_RPC_URL",
      description: "Polygon Mainnet RPC URL",
      validate: (value) => {
        if (!value) return "Missing";
        if (!value.startsWith("http")) return "Invalid URL format";
        return null;
      },
    });
  }

  if (network === "mumbai" || network === "all") {
    required.push({
      key: "MUMBAI_RPC_URL",
      description: "Polygon Mumbai Testnet RPC URL",
      validate: (value) => {
        if (!value) return "Missing";
        if (!value.startsWith("http")) return "Invalid URL format";
        return null;
      },
    });
  }

  // Optional but recommended
  optional.push({
    key: "POLYGONSCAN_API_KEY",
    description: "PolygonScan API key for contract verification",
    recommended: true,
  });

  optional.push({
    key: "CONTRACT_ADDRESS",
    description: "Deployed contract address (set after first deployment)",
    recommended: false,
  });

  // Validate required variables
  log("Checking required environment variables...\n", "blue");
  for (const variable of required) {
    const value = process.env[variable.key];
    if (!value) {
      errors.push({
        key: variable.key,
        message: `Missing required variable: ${variable.key}`,
        description: variable.description,
      });
      log(`  ❌ ${variable.key}: Missing`, "red");
    } else {
      // Run custom validation if provided
      if (variable.validate) {
        const validationError = variable.validate(value);
        if (validationError) {
          errors.push({
            key: variable.key,
            message: `${variable.key}: ${validationError}`,
            description: variable.description,
          });
          log(`  ❌ ${variable.key}: ${validationError}`, "red");
        } else {
          // Mask sensitive values
          const displayValue =
            variable.key === "PRIVATE_KEY"
              ? `${value.substring(0, 8)}...${value.substring(value.length - 4)}`
              : value;
          log(`  ✅ ${variable.key}: ${displayValue}`, "green");
        }
      } else {
        const displayValue =
          variable.key === "PRIVATE_KEY"
            ? `${value.substring(0, 8)}...${value.substring(value.length - 4)}`
            : value;
        log(`  ✅ ${variable.key}: ${displayValue}`, "green");
      }
    }
  }

  // Check optional variables
  log("\nChecking optional environment variables...\n", "blue");
  for (const variable of optional) {
    const value = process.env[variable.key];
    if (!value) {
      if (variable.recommended) {
        warnings.push({
          key: variable.key,
          message: `Recommended variable not set: ${variable.key}`,
          description: variable.description,
        });
        log(`  ⚠️  ${variable.key}: Not set (recommended)`, "yellow");
      } else {
        log(`  ⚪ ${variable.key}: Not set (optional)`, "reset");
      }
    } else {
      log(`  ✅ ${variable.key}: Set`, "green");
    }
  }

  // Summary
  log("\n" + "=".repeat(60), "blue");
  log("  Validation Summary", "blue");
  log("=".repeat(60) + "\n", "blue");

  if (errors.length === 0 && warnings.length === 0) {
    log("✅ All required environment variables are set!", "green");
    log("✅ No warnings\n", "green");
    return 0;
  }

  if (errors.length > 0) {
    log(`❌ Found ${errors.length} error(s):\n`, "red");
    errors.forEach((error) => {
      log(`  • ${error.key}`, "red");
      log(`    ${error.description}`, "reset");
      log(`    ${error.message}\n`, "red");
    });
  }

  if (warnings.length > 0) {
    log(`⚠️  Found ${warnings.length} warning(s):\n`, "yellow");
    warnings.forEach((warning) => {
      log(`  • ${warning.key}`, "yellow");
      log(`    ${warning.description}\n`, "reset");
    });
  }

  log("\nTo fix:", "blue");
  log("  1. Copy .env.example to .env", "reset");
  log("  2. Fill in the required values", "reset");
  log("  3. Run this script again\n", "reset");

  return errors.length > 0 ? 1 : 0;
}

// Run validation
const exitCode = validateEnv();
process.exit(exitCode);




