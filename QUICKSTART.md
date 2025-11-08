# Quick Start Guide

Get ChainCheck running locally in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- MetaMask browser extension

## Setup

1. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install && cd ..
   cd qr-generator && npm install && cd ..
   ```

2. **Start local blockchain**
   ```bash
   npx hardhat node
   ```
   Keep this terminal open. You'll see test accounts with ETH.

3. **Deploy contract** (new terminal)
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```
   Copy the contract address from the output.

4. **Update frontend config**
   - Open `frontend/src/config.ts`
   - Set `CONTRACT_ADDRESS` to the address from step 3
   - Set `CURRENT_NETWORK` to `NETWORK_CONFIG.localhost`

5. **Start QR generator** (new terminal)
   ```bash
   cd qr-generator
   npm start
   ```

6. **Start frontend** (new terminal)
   ```bash
   cd frontend
   npm run dev
   ```

7. **Connect MetaMask**
   - Open http://localhost:3000
   - Add localhost network in MetaMask:
     - Network Name: Localhost 8545
     - RPC URL: http://127.0.0.1:8545
     - Chain ID: 1337
     - Currency Symbol: ETH
   - Import a test account from Hardhat node (private keys shown in terminal)

## Test the Flow

1. **Register a test product**
   ```bash
   # Update CONTRACT_ADDRESS in scripts/register-product.js first
   npx hardhat run scripts/register-product.js --network localhost
   ```

2. **Generate a QR code**
   - Visit: http://localhost:3001/qr?batchId=1&serialNumber=SN001

3. **Verify in frontend**
   - Open http://localhost:3000
   - Connect wallet
   - Click "Start Scan"
   - Scan the QR code from step 2
   - See verification result

## Troubleshooting

**MetaMask connection issues:**
- Make sure you're on localhost network (Chain ID: 1337)
- Check that Hardhat node is running
- Try refreshing the page

**QR scanner not working:**
- Allow camera permissions
- Use HTTPS or localhost (required for camera access)
- Try a different browser

**Contract errors:**
- Verify contract address is correct
- Check you're on the right network
- Ensure contract is deployed

## Next Steps

- Read the full README.md for detailed documentation
- Check DEPLOYMENT.md for production deployment
- Review CONTRIBUTING.md to contribute

Happy building!

