#!/bin/bash

# Script to prepare materials for security audit
# Creates a clean package with all necessary files for auditors

set -e

AUDIT_DIR="audit-materials"
TIMESTAMP=$(date +%Y%m%d)

echo "Preparing audit materials for ChainCheck..."
echo ""

# Create audit directory
mkdir -p "$AUDIT_DIR"

# Copy contract source code
echo "Copying contract source code..."
mkdir -p "$AUDIT_DIR/contracts"
cp contracts/ChainCheck.sol "$AUDIT_DIR/contracts/"

# Copy test files
echo "Copying test files..."
mkdir -p "$AUDIT_DIR/test"
cp test/*.js "$AUDIT_DIR/test/" 2>/dev/null || echo "No test files found"

# Copy deployment scripts
echo "Copying deployment scripts..."
mkdir -p "$AUDIT_DIR/scripts"
cp scripts/deploy*.js "$AUDIT_DIR/scripts/" 2>/dev/null || true
cp scripts/verify-contract.js "$AUDIT_DIR/scripts/" 2>/dev/null || true

# Copy configuration files
echo "Copying configuration files..."
cp hardhat.config.js "$AUDIT_DIR/" 2>/dev/null || true
cp package.json "$AUDIT_DIR/" 2>/dev/null || true
cp package-lock.json "$AUDIT_DIR/" 2>/dev/null || true

# Copy documentation
echo "Copying documentation..."
mkdir -p "$AUDIT_DIR/docs"
cp README.md "$AUDIT_DIR/docs/" 2>/dev/null || true
cp API.md "$AUDIT_DIR/docs/" 2>/dev/null || true
cp SECURITY_AUDIT.md "$AUDIT_DIR/docs/" 2>/dev/null || true
cp GAS_OPTIMIZATION.md "$AUDIT_DIR/docs/" 2>/dev/null || true
cp CONTRACT_UPGRADE_GUIDE.md "$AUDIT_DIR/docs/" 2>/dev/null || true
cp SECURITY_AUDIT_PREPARATION.md "$AUDIT_DIR/docs/" 2>/dev/null || true

# Create audit README
echo "Creating audit README..."
cat > "$AUDIT_DIR/README.md" << 'EOF'
# ChainCheck Security Audit Materials

This package contains all materials needed for a professional security audit of the ChainCheck smart contract.

## Contents

- `contracts/` - Smart contract source code
- `test/` - Test suite
- `scripts/` - Deployment and verification scripts
- `docs/` - Documentation
- `package.json` - Dependencies

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run tests:
   ```bash
   npm test
   ```

3. Compile contracts:
   ```bash
   npm run compile
   ```

## Contract Overview

**Contract:** ChainCheck.sol
**Version:** Solidity 0.8.20
**Network:** Polygon Mainnet
**Purpose:** Product authenticity verification system

### Key Features
- Manufacturer authorization system
- Product batch registration
- Serial number verification (hashed)
- Reentrancy protection
- Emergency pause functionality

### Security Features
- Access control (owner, authorized manufacturers)
- Reentrancy guard
- Input validation
- Custom errors for gas optimization
- Maximum batch size limits

## Test Coverage

Run test coverage:
```bash
npx hardhat coverage
```

Target: >90% coverage

## Documentation

See `docs/` directory for:
- API documentation
- Security audit checklist
- Gas optimization guide
- Contract upgrade guide

## Questions?

Refer to the main project README or contact the development team.

EOF

# Create summary file
echo "Creating audit summary..."
cat > "$AUDIT_DIR/AUDIT_SUMMARY.md" << EOF
# ChainCheck Audit Summary

**Date Prepared:** $(date +%Y-%m-%d)
**Contract:** ChainCheck.sol
**Version:** Solidity 0.8.20
**Network:** Polygon Mainnet

## Contract Statistics

- **Lines of Code:** ~665
- **Functions:** ~15 public/external
- **State Variables:** ~10
- **Events:** ~5
- **Test Coverage:** >90% (verify with \`npx hardhat coverage\`)

## Key Components

1. **Access Control**
   - Owner functions (authorize manufacturers, pause)
   - Manufacturer functions (register products)
   - Public functions (verify products)

2. **Core Functionality**
   - \`authorizeManufacturer()\` - Authorize/revoke manufacturers
   - \`registerProduct()\` - Register product batches
   - \`verify()\` - Verify single product
   - \`verifyBatch()\` - Verify multiple products
   - \`pause()\` / \`unpause()\` - Emergency controls

3. **Security Features**
   - Reentrancy guard (\`nonReentrant\` modifier)
   - Access control modifiers (\`onlyOwner\`, \`onlyMaker\`)
   - Pause functionality (\`whenNotPaused\`, \`whenPaused\`)
   - Input validation
   - Serial number hashing

## Known Limitations

1. Contract is NOT upgradeable (immutable)
2. Serial hashes are public on-chain
3. Relies on authorized manufacturers
4. Users pay gas for verifications

## Security Assumptions

1. Owner address is secure
2. Manufacturers are trusted
3. Polygon network is reliable
4. Serial numbers are kept secret by manufacturers

## Areas of Focus for Audit

1. **Access Control**
   - Verify only authorized users can call restricted functions
   - Check for privilege escalation vulnerabilities

2. **Reentrancy**
   - Verify reentrancy guard is effective
   - Check for cross-function reentrancy

3. **Input Validation**
   - Verify all inputs are validated
   - Check for edge cases (zero values, max values, etc.)

4. **Logic Errors**
   - Verify verification logic is correct
   - Check batch operations for correctness

5. **Gas Optimization**
   - Review gas usage patterns
   - Check for optimization opportunities

6. **Front-running**
   - Assess front-running risks
   - Verify no MEV vulnerabilities

## Test Files

- \`test/ChainCheck.test.js\` - Main test suite
  - Access control tests
  - Product registration tests
  - Verification tests
  - Edge case tests
  - Gas optimization tests

## Deployment Information

- **Network:** Polygon Mainnet
- **Compiler:** Solidity 0.8.20
- **Optimizer:** Enabled (200 runs)
- **Constructor:** No parameters (owner = deployer)

## Previous Audits

- **Self-Audit:** Completed (see SECURITY_AUDIT.md)
- **Professional Audit:** Pending

EOF

# Create zip archive
echo ""
echo "Creating archive..."
cd "$AUDIT_DIR"
zip -r "../chaincheck-audit-materials-${TIMESTAMP}.zip" . > /dev/null
cd ..

echo ""
echo "Audit materials prepared successfully!"
echo ""
echo "Location: $AUDIT_DIR/"
echo "Archive: chaincheck-audit-materials-${TIMESTAMP}.zip"
echo ""
echo "Next steps:"
echo "1. Review the materials in $AUDIT_DIR/"
echo "2. Test that everything works: cd $AUDIT_DIR && npm install && npm test"
echo "3. Send the archive to audit firm"
echo ""




