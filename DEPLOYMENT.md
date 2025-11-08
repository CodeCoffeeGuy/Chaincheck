# Deployment Guide

This guide provides step-by-step instructions for deploying ChainCheck to production.

## Prerequisites

- Node.js 18+ installed
- MetaMask wallet with test/mainnet MATIC
- GitHub account (for CI/CD)
- Vercel account (for frontend hosting, optional)

## Step 1: Smart Contract Deployment

### Mumbai Testnet (Recommended for Testing)

1. **Get Test MATIC**
   - Visit https://faucet.polygon.technology
   - Enter your wallet address
   - Request test tokens

2. **Configure Environment**
   ```bash
   # Create .env file
   PRIVATE_KEY=your_private_key_here
   MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
   POLYGONSCAN_API_KEY=your_api_key_here  # Optional, for verification
   ```

3. **Deploy Contract**
   ```bash
   npx hardhat run scripts/deploy.js --network mumbai
   ```

4. **Save Contract Address**
   - Copy the deployed contract address from the output
   - You'll need this for the frontend configuration

5. **Verify Contract** (Optional)
   ```bash
   npx hardhat verify --network mumbai <CONTRACT_ADDRESS>
   ```

### Polygon Mainnet

1. **Ensure Sufficient MATIC**
   - You need MATIC for gas fees
   - Recommended: At least 0.1 MATIC

2. **Configure Environment**
   ```bash
   PRIVATE_KEY=your_private_key_here
   POLYGON_RPC_URL=https://polygon-rpc.com
   POLYGONSCAN_API_KEY=your_api_key_here
   ```

3. **Deploy Contract**
   ```bash
   npx hardhat run scripts/deploy.js --network polygon
   ```

4. **Verify Contract**
   ```bash
   npx hardhat verify --network polygon <CONTRACT_ADDRESS>
   ```

## Step 2: Frontend Configuration

1. **Update Contract Address**
   - Open `frontend/src/config.ts`
   - Update `CONTRACT_ADDRESS` with your deployed address
   - Set `CURRENT_NETWORK` to match your deployment (mumbai or polygon)

2. **Update Contract ABI** (if modified)
   - After compiling contracts, copy the ABI from:
     `artifacts/contracts/ChainCheck.sol/ChainCheck.json`
   - Replace the `CONTRACT_ABI` array in `frontend/src/config.ts`

3. **Build Frontend**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

## Step 3: Deploy Frontend

### Option A: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd frontend
   vercel --prod
   ```

4. **Configure Custom Domain** (Optional)
   - Follow Vercel's domain configuration guide

### Option B: Netlify

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Build and Deploy**
   ```bash
   cd frontend
   npm run build
   netlify deploy --prod --dir=dist
   ```

### Option C: GitHub Pages

1. **Install gh-pages**
   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```

2. **Add to package.json**
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

### Option D: Manual Hosting

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload dist/ folder** to your hosting service:
   - AWS S3 + CloudFront
   - DigitalOcean Spaces
   - Any static hosting service

## Step 4: QR Generator Service (Optional)

The QR generator can run locally or be deployed separately.

### Local Development
```bash
cd qr-generator
npm install
npm start
```

### Deploy to Heroku

1. **Install Heroku CLI**
2. **Create Heroku App**
   ```bash
   heroku create chaincheck-qr-generator
   ```

3. **Deploy**
   ```bash
   git subtree push --prefix qr-generator heroku main
   ```

### Deploy to Railway

1. Connect your GitHub repository
2. Set root directory to `qr-generator`
3. Deploy automatically

## Step 5: Post-Deployment Checklist

- [ ] Contract deployed and verified
- [ ] Frontend updated with contract address
- [ ] Frontend deployed and accessible
- [ ] Test verification flow end-to-end
- [ ] Test on mobile devices
- [ ] Check network switching works
- [ ] Verify error handling
- [ ] Update README with live URLs
- [ ] Set up monitoring (optional)

## Step 6: Testing Production

1. **Test Verification Flow**
   - Register a test product
   - Generate QR code
   - Scan and verify on production site

2. **Test Error Cases**
   - Invalid QR codes
   - Network errors
   - Wallet connection issues

3. **Performance Testing**
   - Load times
   - Transaction confirmation times
   - Mobile performance

## Troubleshooting

### Contract Deployment Fails

- Check you have sufficient MATIC
- Verify network configuration
- Check RPC URL is correct
- Ensure private key is correct

### Frontend Can't Connect

- Verify contract address is correct
- Check network configuration matches
- Ensure MetaMask is on correct network
- Check browser console for errors

### QR Scanner Not Working

- Check camera permissions
- Test on HTTPS (required for camera)
- Try different browsers
- Check mobile device compatibility

## Security Notes

- Never commit `.env` file
- Use environment variables for secrets
- Verify contract on PolygonScan
- Use HTTPS for production frontend
- Regularly update dependencies

## Next Steps

After deployment:
1. Share your live demo
2. Collect user feedback
3. Monitor usage and errors
4. Plan improvements based on data

