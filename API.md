# ChainCheck API Documentation

## Overview

ChainCheck is a blockchain-based product authenticity verification system built on Polygon. This document provides API documentation for developers integrating with ChainCheck.

## Smart Contract Interface

### Contract Address

- **Polygon Mainnet**: Set via `VITE_CONTRACT_ADDRESS` environment variable
- **Mumbai Testnet**: Deploy and update config
- **Localhost**: Deploy locally using Hardhat

### Core Functions

#### 1. Register Product Batch

Register a new product batch with serial numbers.

```solidity
function registerProductBatch(
 uint256 batchId,
 string memory name,
 string memory brand,
 bytes32[] memory serialHashes
) external
```

**Parameters:**
- `batchId`: Unique batch identifier
- `name`: Product name
- `brand`: Brand name
- `serialHashes`: Array of hashed serial numbers

**Requirements:**
- Caller must be authorized manufacturer
- Batch ID must not exist
- Serial hashes array must not be empty

**Events:**
- `ProductBatchRegistered(uint256 indexed batchId, string name, string brand, address indexed manufacturer)`

#### 2. Verify Product

Verify a product's authenticity.

```solidity
function verifyProduct(
 bytes32 serialHash,
 uint256 batchId
) external returns (bool)
```

**Parameters:**
- `serialHash`: Keccak256 hash of batchId + serialNumber
- `batchId`: Product batch ID

**Returns:**
- `bool`: `true` if authentic (first verification), `false` if potential counterfeit

**Events:**
- `ProductVerified(bytes32 indexed serialHash, uint256 indexed batchId, address indexed verifier, bool isAuthentic)`

#### 3. Get Product Info

Retrieve product batch information.

```solidity
function getProductInfo(uint256 batchId) external view returns (Product memory)
```

**Parameters:**
- `batchId`: Product batch ID

**Returns:**
- `Product` struct with name, brand, registration timestamp, etc.

#### 4. Get Verification History

Get all verifications for a serial number.

```solidity
function getVerificationHistory(bytes32 serialHash) external view returns (VerificationRecord[] memory)
```

**Parameters:**
- `serialHash`: Hashed serial number

**Returns:**
- Array of verification records with timestamps and verifier addresses

## Frontend Integration

### Connecting to Contract

```typescript
import { getContract } from "./utils/blockchain";

const contract = getContract();
```

### Verifying a Product

```typescript
import { verifyProduct, generateSerialHash } from "./utils/blockchain";

const batchId = 1;
const serialNumber = "SN001";
const serialHash = generateSerialHash(batchId, serialNumber);

const result = await verifyProduct(serialHash, batchId);
console.log("Is Authentic:", result.isAuthentic);
console.log("Product Name:", result.productName);
```

### Offline QR Validation

```typescript
import { validateQRCodeOffline } from "./utils/qrValidator";

const qrData = "1:SN001"; // or JSON format
const validation = validateQRCodeOffline(qrData);

if (validation.valid) {
 console.log("Batch ID:", validation.batchId);
 console.log("Serial Number:", validation.serialNumber);
}
```

## QR Code Formats

ChainCheck supports two QR code formats:

### Format 1: Colon-Separated
```
BATCH_ID:SERIAL_NUMBER
Example: 1:SN001
```

### Format 2: JSON
```json
{
 "batchId": "1",
 "serialNumber": "SN001"
}
```

## Events

### ProductBatchRegistered

Emitted when a new product batch is registered.

```solidity
event ProductBatchRegistered(
 uint256 indexed batchId,
 string name,
 string brand,
 address indexed manufacturer
);
```

### ProductVerified

Emitted when a product is verified.

```solidity
event ProductVerified(
 bytes32 indexed serialHash,
 uint256 indexed batchId,
 address indexed verifier,
 bool isAuthentic
);
```

## Error Handling

Common errors and solutions:

- **"Not authorized"**: Caller is not an authorized manufacturer
- **"Batch not found"**: Invalid batch ID
- **"Serial not in batch"**: Serial number doesn't belong to the batch
- **"Contract paused"**: Contract is currently paused

## Network Configuration

### Polygon Mainnet
- Chain ID: 137
- RPC URL: `https://polygon-rpc.com`
- Block Explorer: https://polygonscan.com

### Mumbai Testnet
- Chain ID: 80001
- RPC URL: `https://rpc-mumbai.maticvigil.com`
- Block Explorer: https://mumbai.polygonscan.com

## Rate Limits

- No rate limits on read operations (view functions)
- Write operations limited by network gas limits
- Recommended: Batch operations when registering multiple products

## Best Practices

1. **Always validate QR codes offline** before blockchain verification
2. **Handle errors gracefully** - network issues are common
3. **Cache product info** when possible to reduce RPC calls
4. **Use event listeners** for real-time updates
5. **Implement retry logic** for failed transactions

## Support

For issues or questions:
- GitHub: https://github.com/chaincheck
- Documentation: See README.md

