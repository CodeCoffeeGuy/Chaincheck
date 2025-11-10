# How to Fund Your Wallet for Polygon Mainnet Deployment

Your deployer wallet address: **`0xfc39e95284544C555F5695bCd13656Aafd034b9f`**

You need at least **0.1 MATIC** (recommended: 0.2+ MATIC) to deploy the contract.

## Option 1: Buy MATIC on an Exchange (Recommended)

1. **Sign up for an exchange** (if you don't have one):
   - Coinbase: https://www.coinbase.com/
   - Binance: https://www.binance.com/
   - Kraken: https://www.kraken.com/
   - Crypto.com: https://crypto.com/

2. **Buy MATIC**:
   - Deposit fiat currency (USD, EUR, etc.)
   - Buy MATIC (Polygon) tokens
   - Minimum: 0.2 MATIC (to cover gas + buffer)

3. **Withdraw to your wallet**:
   - Go to "Withdraw" or "Send"
   - Select Polygon network (NOT Ethereum!)
   - Enter your wallet address: `0xfc39e95284544C555F5695bCd13656Aafd034b9f`
   - Send the MATIC

## Option 2: Bridge from Ethereum

If you have ETH or MATIC on Ethereum:

1. **Use Polygon Bridge**:
   - Visit: https://portal.polygon.technology/polygon/bridge
   - Connect your wallet
   - Bridge MATIC from Ethereum to Polygon

2. **Or use other bridges**:
   - Hop Protocol: https://hop.exchange/
   - Across Protocol: https://across.to/

## Option 3: Use a Fiat On-Ramp

1. **Ramp Network**:
   - Visit: https://ramp.network/
   - Buy MATIC directly with credit card
   - Send to your wallet address

2. **MoonPay**:
   - Visit: https://www.moonpay.com/
   - Buy MATIC with credit card
   - Send to Polygon network

## Verify Your Balance

After funding, verify your balance:

```bash
cd /Users/nikostojak/Chaincheck
npx hardhat run scripts/deploy-production.js --network polygon
```

The script will check your balance and proceed with deployment if sufficient.

## Quick Check Command

To check your current balance:

```bash
node -e "require('dotenv').config(); const { ethers } = require('ethers'); const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com'); const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider); provider.getBalance(wallet.address).then(balance => console.log('Balance:', ethers.formatEther(balance), 'MATIC'));"
```

## Estimated Costs

- **Contract Deployment**: ~0.063 MATIC
- **Recommended Buffer**: 0.1-0.2 MATIC total

## Important Notes

⚠️ **Always verify**:
- You're sending to Polygon network (not Ethereum)
- The wallet address is correct: `0xfc39e95284544C555F5695bCd13656Aafd034b9f`
- You have enough for gas fees (0.1+ MATIC recommended)

## After Funding

Once your wallet is funded, run:

```bash
npx hardhat run scripts/deploy-production.js --network polygon
```

This will:
1. Check your balance
2. Deploy the contract
3. Verify on PolygonScan
4. Provide instructions to update the frontend

