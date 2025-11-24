# ChainCheck

**Blockchain-based Product Authenticity Verification System**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-green.svg)](https://github.com/CodeAndCoffeeGuy/Chaincheck)

ChainCheck is a decentralized application (dApp) that enables consumers to verify product authenticity using blockchain technology. By scanning a QR code, users can instantly determine if a product is genuine or potentially counterfeit.

## Problem

Counterfeit products cost the global economy over $500 billion annually. Consumers have no reliable way to verify product authenticity, and brands lose revenue to fake goods. Traditional verification methods are easily compromised and lack transparency.

## Solution

ChainCheck provides a transparent, immutable verification system:

1. **Manufacturers** register products on the blockchain with unique serial numbers
2. **Each product** receives a unique QR code containing batch ID and serial number
3. **Consumers** scan the QR code to verify authenticity on-chain
4. **First scan** = Authentic | **Second scan** = Potential Counterfeit

## Features

- **On-chain Verification**: All verifications are recorded on Polygon blockchain
- **Mobile-First Scanner**: No app installation required, works in any browser
- **Real-time Results**: Instant verification with blockchain confirmation
- **Tamper-Proof**: Immutable records prevent fraud
- **Low Cost**: Built on Polygon for minimal transaction fees
- **Open Source**: Transparent and auditable codebase

## Tech Stack

### Smart Contracts
- **Solidity** 0.8.20
- **Hardhat** - Development framework
- **Polygon** - Low-cost blockchain network

### Frontend
- **React** 18 - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Ethers.js** - Blockchain interactions
- **html5-qrcode** - QR code scanning

### Backend Services
- **Node.js** - QR code generation service
- **Express** - Web server
- **QRCode** - QR code library

## Project Structure

```
ChainCheck/
 contracts/ # Smart contracts
 ChainCheck.sol # Main verification contract
 frontend/ # React application
 src/
 App.tsx # Main application component
 config.ts # Configuration and contract ABI
 utils/ # Blockchain utility functions
 package.json
 qr-generator/ # QR code generation service
 server.js
 scripts/ # Deployment scripts
 deploy.js
 test/ # Test suite
 ChainCheck.test.js
 hardhat.config.js # Hardhat configuration
 README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MetaMask browser extension
- Git

### Installation

1. **Clone the repository**
 ```bash
 git clone https://github.com/yourusername/ChainCheck.git
 cd ChainCheck
 ```

2. **Install root dependencies**
 ```bash
 npm install
 ```

3. **Install frontend dependencies**
 ```bash
 cd frontend
 npm install
 cd ..
 ```

4. **Install QR generator dependencies**
 ```bash
 cd qr-generator
 npm install
 cd ..
 ```

5. **Set up environment variables**
 ```bash
 # Root directory
 cp .env.example .env
 
 # Frontend directory
 cd frontend
 cp .env.example .env
 cd ..
 ```
 Edit `.env` files and add your configuration:
 - Root `.env`: Add `PRIVATE_KEY`, `POLYGON_RPC_URL`, etc.
 - Frontend `.env`: Add `VITE_CONTRACT_ADDRESS` after deployment
 
 **Validate environment variables:**
 ```bash
 npm run validate-env
 ```

### Local Development

1. **Start local Hardhat node**
 ```bash
 npx hardhat node
 ```
 Keep this terminal running.

2. **Deploy contract to local network** (in a new terminal)
 ```bash
 npx hardhat run scripts/deploy.js --network localhost
 ```
 Copy the deployed contract address.

3. **Update frontend configuration**
 - Open `frontend/src/config.ts`
 - Update `CONTRACT_ADDRESS` with the deployed address
 - Set `CURRENT_NETWORK` to `NETWORK_CONFIG.localhost`

4. **Start QR generator service** (in a new terminal)
 ```bash
 cd qr-generator
 npm start
 ```

5. **Start frontend development server** (in a new terminal)
 ```bash
 cd frontend
 npm run dev
 ```

6. **Access the application**
 - Open http://localhost:3000 in your browser
 - Connect MetaMask to localhost network (Chain ID: 1337)
 - Import test accounts from Hardhat node for testing

### Testing

Run the test suite:
```bash
npm test
```

The test suite covers:
- Contract deployment
- Manufacturer authorization
- Product registration
- Product verification (authentic and fake)
- Access control
- Edge cases

## Deployment

### Deploy Smart Contract

#### Prerequisites

1. **Set up environment variables**
 ```bash
 cp .env.example .env
 # Edit .env and add your PRIVATE_KEY and other required variables
 ```

2. **Validate environment**
 ```bash
 npm run validate-env
 ```

#### Mumbai Testnet

1. **Get test MATIC**
 - Visit https://faucet.polygon.technology
 - Request test tokens for your address

2. **Deploy contract**
 ```bash
 npm run deploy:mumbai
 # Or manually:
 # npx hardhat run scripts/deploy.js --network mumbai
 ```

3. **Verify contract** (optional)
 ```bash
 npx hardhat verify --network mumbai <CONTRACT_ADDRESS>
 ```

#### Polygon Mainnet

1. **Ensure sufficient MATIC** in your wallet

2. **Deploy contract**
 ```bash
 npm run deploy:prod
 # Or manually:
 # npx hardhat run scripts/deploy-production.js --network polygon
 ```

3. **Update frontend configuration**
 - Option A (Recommended): Set `VITE_CONTRACT_ADDRESS` in `frontend/.env`
 - Option B: Update `CONTRACT_ADDRESS` in `frontend/src/config.ts`
 - Set `CURRENT_NETWORK` to `NETWORK_CONFIG.polygon` in `frontend/src/config.ts`

### Deploy Frontend

#### Vercel (Recommended)

1. **Install Vercel CLI**
 ```bash
 npm i -g vercel
 ```

2. **Build frontend**
 ```bash
 cd frontend
 npm run build
 ```

3. **Deploy**
 ```bash
 vercel --prod
 ```

#### Other Platforms

The frontend is a standard React application and can be deployed to:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

### Deploy QR Generator

The QR generator service includes:
- Rate limiting (100 requests/15min per IP)
- Request logging (Morgan)
- Error handling
- Health check endpoint (`/health`)
- Production-ready error messages

**Deploy to:**
- Heroku
- Railway
- Render
- AWS EC2
- Any Node.js hosting service

**Environment variables:**
```bash
PORT=3001 # Optional, defaults to 3001
NODE_ENV=production # Set to production for production deployment
```

**Health check:**
```bash
curl http://your-service-url/health
```

Or use it locally for development:
```bash
npm run server
```

## Monitoring & Analytics

### Error Tracking (Sentry)

ChainCheck includes Sentry integration for production error tracking:

1. **Set up Sentry:**
 - Create account at https://sentry.io
 - Create a React project
 - Copy your DSN

2. **Configure:**
 ```bash
 # Add to frontend/.env
 VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
 ```

3. **Features:**
 - Automatic error capture
 - Performance monitoring
 - Session replay on errors
 - User context tracking

### Analytics (PostHog)

Track user behavior and business metrics with PostHog:

1. **Set up PostHog:**
 - Create account at https://posthog.com
 - Create a new project
 - Copy your API key (phc_...)

2. **Configure:**
 ```bash
 # Add to frontend/.env
 VITE_POSTHOG_KEY=phc_your_api_key_here
 # Optional: If self-hosting
 # VITE_POSTHOG_HOST=https://your-posthog-instance.com
 ```

3. **What's Tracked:**
 - Page views (automatic)
 - QR code scans
 - Product verifications
 - Wallet connections
 - Errors
 - Session recordings (optional)
 - Feature flags support

4. **Features:**
 - Automatic event capture
 - Session replay
 - User identification
 - Privacy-focused (GDPR-ready)
 - Open source (can self-host)

See [MONITORING_SETUP.md](./MONITORING_SETUP.md) for complete monitoring setup guide.

## CI/CD

ChainCheck includes GitHub Actions workflows for automated testing and deployment:

### Workflows

1. **CI Pipeline** (`.github/workflows/ci.yml`)
 - Runs on every push/PR
 - Tests and lints code
 - Builds frontend
 - Security audits
 - Auto-deploys to staging/production

2. **Contract Deployment** (`.github/workflows/contract-deploy.yml`)
 - Manual workflow for contract deployment
 - Supports Mumbai and Polygon networks
 - Optional contract verification

### Setup

1. **Add GitHub Secrets:**
 - `VERCEL_TOKEN` - Vercel deployment token
 - `VERCEL_ORG_ID` - Vercel organization ID
 - `VERCEL_PROJECT_ID` - Vercel project ID
 - `PRIVATE_KEY` - For contract deployment
 - `POLYGON_RPC_URL` - Polygon RPC endpoint
 - `POLYGONSCAN_API_KEY` - For contract verification

2. **Workflow Triggers:**
 - Push to `main` → Deploy to production
 - Push to `develop` → Deploy to staging
 - Pull requests → Run tests only

See workflow files in `.github/workflows/` for details.

## Usage

### For Manufacturers

1. **Get authorized** by the contract owner
2. **Register products** using the `registerProduct` function:
 ```javascript
 registerProduct(
 batchId: 1,
 name: "Premium Sneakers",
 brand: "Nike",
 serialHashes: [hash1, hash2, ...]
 )
 ```
3. **Generate QR codes** using the QR generator service
4. **Attach QR codes** to products

### For Consumers

1. **Open ChainCheck** in your browser
2. **Connect MetaMask** wallet
3. **Click "Start Scan"** and allow camera access
4. **Scan QR code** on the product
5. **View result**: Authentic or Potential Counterfeit

### QR Code Format

QR codes contain product data in one of two formats:

**Colon-separated** (default):
```
1:SN123456
```

**JSON format**:
```json
{"batchId":"1","serialNumber":"SN123456"}
```

## Security Considerations

- **Private Keys**: Never commit private keys to version control
- **Access Control**: Only authorized manufacturers can register products
- **Serial Hashing**: Serial numbers are hashed to prevent guessing
- **One-time Verification**: Each serial can only be verified once as authentic
- **Network Security**: Always verify you're on the correct network

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Open Source

ChainCheck is open source and available on GitHub. Contributions are welcome!

- **Repository**: [https://github.com/CodeAndCoffeeGuy/Chaincheck](https://github.com/CodeAndCoffeeGuy/Chaincheck)
- **Live Demo**: [https://chaincheck.io](https://chaincheck.io)
- **Issues**: Report bugs or request features on GitHub

## Security

**Important Security Notes:**
- Never commit `.env` files or private keys
- All sensitive data uses environment variables
- Private keys are only used locally for deployment
- Frontend code is safe to be public (no secrets exposed)

## Roadmap

- [ ] NFC chip integration
- [ ] Manufacturer dashboard UI
- [ ] Batch QR code generation tool
- [ ] IPFS metadata storage
- [ ] Multi-chain support
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard
- [ ] API for third-party integrations

## Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check existing documentation
- Review test files for usage examples

## Acknowledgments

- Built with Hardhat, React, and Polygon
- Inspired by the need for transparent product verification
- Open source and community-driven

---

**Built with care for a more trustworthy marketplace.**

