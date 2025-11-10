# Production Deployment Checklist

Use this checklist to ensure a smooth deployment to Polygon mainnet.

## Pre-Deployment

### 1. Environment Setup
- [ ] `.env` file created in project root
- [ ] `PRIVATE_KEY` set (deployer wallet private key)
- [ ] `POLYGON_RPC_URL` set (optional, defaults to public RPC)
- [ ] `POLYGONSCAN_API_KEY` set (for contract verification)

### 2. Wallet Funding
- [ ] Deployer wallet has at least **0.1 MATIC** (recommended: 0.2+ MATIC)
- [ ] Wallet address: `0xfc39e95284544C555F5695bCd13656Aafd034b9f`
- [ ] Verified balance on Polygon mainnet

### 3. Code Review
- [ ] Contracts compiled successfully (`npx hardhat compile`)
- [ ] All tests passing (`npm test`)
- [ ] Frontend builds successfully (`cd frontend && npm run build`)
- [ ] No TypeScript errors
- [ ] No linter errors

### 4. Configuration
- [ ] Frontend configured for Polygon mainnet (`CURRENT_NETWORK = NETWORK_CONFIG.polygon`)
- [ ] Contract ABI is up to date in `frontend/src/config.ts`

## Deployment

### 5. Smart Contract Deployment
- [ ] Run deployment script:
  ```bash
  npx hardhat run scripts/deploy-production.js --network polygon
  ```
- [ ] Deployment successful
- [ ] Contract address saved
- [ ] Contract verified on PolygonScan (optional but recommended)

### 6. Frontend Configuration
- [ ] Contract address updated in `frontend/src/config.ts` OR
- [ ] `VITE_CONTRACT_ADDRESS` set in `frontend/.env`
- [ ] Frontend rebuilt: `cd frontend && npm run build`

### 7. Frontend Deployment
- [ ] Frontend deployed to hosting service (Vercel, Netlify, etc.)
- [ ] Environment variables set in hosting platform (if using .env)
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active

## Post-Deployment

### 8. Testing
- [ ] Frontend accessible and loads correctly
- [ ] MetaMask connection works
- [ ] Network switch to Polygon mainnet works
- [ ] Contract interaction works (read functions)
- [ ] Product verification works (write functions)
- [ ] Transaction confirmations work
- [ ] Error handling works correctly

### 9. Security
- [ ] Contract verified on PolygonScan
- [ ] No sensitive data exposed in frontend
- [ ] Environment variables properly secured
- [ ] Private keys never committed to git

### 10. Documentation
- [ ] Contract address documented
- [ ] Deployment date recorded
- [ ] Frontend URL documented
- [ ] Team notified of deployment

## Current Status

**Wallet Balance:** 0.0 MATIC ❌  
**Estimated Deployment Cost:** ~0.063 MATIC  
**Action Required:** Fund wallet with at least 0.1 MATIC

## Quick Commands

```bash
# Check wallet balance
npx hardhat run scripts/deploy-production.js --network polygon

# Deploy contract
npx hardhat run scripts/deploy-production.js --network polygon

# Verify contract
npx hardhat verify --network polygon <CONTRACT_ADDRESS>

# Build frontend
cd frontend && npm run build

# Deploy to Vercel
cd frontend && vercel --prod
```

## Support

If you encounter issues:
1. Check the error message carefully
2. Verify all environment variables are set
3. Ensure wallet has sufficient MATIC
4. Check network connectivity
5. Review deployment logs

