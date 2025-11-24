#!/bin/bash

# GitHub Actions Secrets Setup Script
# This script helps you add secrets to your GitHub repository for CI/CD

set -e

echo "=========================================="
echo "  GitHub Actions Secrets Setup"
echo "=========================================="
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo ""
    echo "Install it with:"
    echo "  brew install gh"
    echo "  # or visit: https://cli.github.com/"
    echo ""
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI."
    echo ""
    echo "Authenticate with:"
    echo "  gh auth login"
    echo ""
    exit 1
fi

echo "✅ GitHub CLI is installed and authenticated"
echo ""

# Get repository info
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "")
if [ -z "$REPO" ]; then
    echo "⚠️  Could not detect repository. Please specify:"
    read -p "Repository (format: owner/repo): " REPO
fi

echo "Repository: $REPO"
echo ""

# Function to add secret
add_secret() {
    local secret_name=$1
    local description=$2
    local get_value_method=$3
    
    echo "Setting up: $secret_name"
    echo "Description: $description"
    echo ""
    
    if [ "$get_value_method" = "prompt" ]; then
        read -sp "Enter value for $secret_name: " secret_value
        echo ""
    elif [ "$get_value_method" = "vercel" ]; then
        echo "Get this from: https://vercel.com/account/tokens"
        read -sp "Enter $secret_name: " secret_value
        echo ""
    else
        read -sp "Enter $secret_name: " secret_value
        echo ""
    fi
    
    if [ -z "$secret_value" ]; then
        echo "⚠️  Skipping $secret_name (empty value)"
        echo ""
        return
    fi
    
    echo "$secret_value" | gh secret set "$secret_name" --repo "$REPO"
    echo "✅ Added $secret_name"
    echo ""
}

# Vercel Secrets
echo "=========================================="
echo "  Vercel Secrets"
echo "=========================================="
echo ""

echo "Get Vercel tokens from: https://vercel.com/account/tokens"
echo ""

add_secret "VERCEL_TOKEN" "Vercel deployment token" "vercel"
add_secret "VERCEL_ORG_ID" "Vercel organization ID (from project settings)" "vercel"
add_secret "VERCEL_PROJECT_ID" "Vercel project ID (from project settings)" "vercel"

# Blockchain Secrets
echo "=========================================="
echo "  Blockchain Secrets"
echo "=========================================="
echo ""

add_secret "PRIVATE_KEY" "Private key for contract deployment (0x...)" "prompt"
add_secret "POLYGON_RPC_URL" "Polygon Mainnet RPC URL" "prompt"
add_secret "MUMBAI_RPC_URL" "Polygon Mumbai Testnet RPC URL" "prompt"
add_secret "POLYGONSCAN_API_KEY" "PolygonScan API key for contract verification" "prompt"

# Optional: Frontend Contract Address
echo "=========================================="
echo "  Optional: Frontend Configuration"
echo "=========================================="
echo ""

read -p "Add VITE_CONTRACT_ADDRESS secret? (y/n): " add_contract
if [ "$add_contract" = "y" ] || [ "$add_contract" = "Y" ]; then
    add_secret "VITE_CONTRACT_ADDRESS" "Deployed contract address (0x...)" "prompt"
fi

echo "=========================================="
echo "  ✅ Setup Complete!"
echo "=========================================="
echo ""
echo "All secrets have been added to: $REPO"
echo ""
echo "View secrets with:"
echo "  gh secret list --repo $REPO"
echo ""
echo "Test the workflow:"
echo "  1. Push to 'develop' branch → Deploys to staging"
echo "  2. Push to 'main' branch → Deploys to production"
echo ""




