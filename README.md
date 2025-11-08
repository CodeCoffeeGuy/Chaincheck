# ChainCheck

**Blockchain-based Product Authenticity Verification System**

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
├── contracts/           # Smart contracts
│   └── ChainCheck.sol  # Main verification contract
├── frontend/           # React application
│   ├── src/
│   │   ├── App.tsx     # Main application component
│   │   ├── config.ts   # Configuration and contract ABI
│   │   └── utils/      # Blockchain utility functions
│   └── package.json
├── qr-generator/       # QR code generation service
│   └── server.js
├── scripts/            # Deployment scripts
│   └── deploy.js
├── test/               # Test suite
│   └── ChainCheck.test.js
├── hardhat.config.js   # Hardhat configuration
└── README.md
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
   cp .env.example .env
   ```
   Edit `.env` and add your private key:
   ```
   PRIVATE_KEY=your_private_key_here
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

#### Mumbai Testnet

1. **Get test MATIC**
   - Visit https://faucet.polygon.technology
   - Request test tokens for your address

2. **Deploy contract**
   ```bash
   npx hardhat run scripts/deploy.js --network mumbai
   ```

3. **Verify contract** (optional)
   ```bash
   npx hardhat verify --network mumbai <CONTRACT_ADDRESS>
   ```

#### Polygon Mainnet

1. **Ensure sufficient MATIC** in your wallet

2. **Deploy contract**
   ```bash
   npx hardhat run scripts/deploy.js --network polygon
   ```

3. **Update frontend configuration**
   - Update `CONTRACT_ADDRESS` in `frontend/src/config.ts`
   - Set `CURRENT_NETWORK` to `NETWORK_CONFIG.polygon`

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

The QR generator can be deployed to:
- Heroku
- Railway
- Render
- AWS EC2
- Any Node.js hosting service

Or use it locally for development.

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

