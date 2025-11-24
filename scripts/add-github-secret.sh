#!/bin/bash

# Quick script to add a single GitHub secret
# Usage: ./scripts/add-github-secret.sh SECRET_NAME "secret_value"

REPO="CodeCoffeeGuy/Chaincheck"

if [ $# -lt 2 ]; then
    echo "Usage: $0 SECRET_NAME \"secret_value\""
    echo ""
    echo "Example:"
    echo "  $0 VERCEL_TOKEN \"your-token-here\""
    exit 1
fi

SECRET_NAME=$1
SECRET_VALUE=$2

echo "$SECRET_VALUE" | gh secret set "$SECRET_NAME" --repo "$REPO"

if [ $? -eq 0 ]; then
    echo "✅ Successfully added secret: $SECRET_NAME"
else
    echo "❌ Failed to add secret: $SECRET_NAME"
    exit 1
fi




