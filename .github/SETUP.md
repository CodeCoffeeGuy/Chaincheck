# GitHub Repository Setup

Follow these steps to set up your ChainCheck repository on GitHub.

## Initial Setup

1. **Create a new repository on GitHub**
   - Go to https://github.com/new
   - Repository name: `ChainCheck`
   - Description: "Blockchain-based product authenticity verification system"
   - Choose Public (recommended for portfolio)
   - Do NOT initialize with README (we already have one)

2. **Initialize Git in your project**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: ChainCheck MVP"
   ```

3. **Connect to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ChainCheck.git
   git branch -M main
   git push -u origin main
   ```

## Repository Settings

1. **Add topics/tags** (in repository settings):
   - blockchain
   - web3
   - solidity
   - react
   - polygon
   - product-verification
   - anti-counterfeit
   - ethereum

2. **Add description:**
   "End counterfeits with one scan. Blockchain-based product authenticity verification on Polygon."

3. **Enable GitHub Pages** (optional):
   - Settings > Pages
   - Source: Deploy from a branch
   - Branch: main, folder: /docs

## Badges to Add

Add these to your README.md (after deployment):

```markdown
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue)
![React](https://img.shields.io/badge/React-18.2-blue)
![Polygon](https://img.shields.io/badge/Polygon-Mainnet-purple)
![License](https://img.shields.io/badge/License-MIT-green)
```

## GitHub Actions

The CI workflow (`.github/workflows/ci.yml`) will automatically:
- Run tests on push/PR
- Compile contracts
- Build frontend

Make sure to enable GitHub Actions in repository settings.

## Releases

Create a release after deployment:
1. Go to Releases > New release
2. Tag: v1.0.0
3. Title: "ChainCheck v1.0.0 - Initial Release"
4. Description: Include features and deployment info

## Social Preview

Add a social preview image:
- Create a 1280x640px image
- Upload in Settings > General > Social preview

## Next Steps

- Add live demo URL to README
- Add contract address to README
- Create demo video and add link
- Share on Twitter/LinkedIn

