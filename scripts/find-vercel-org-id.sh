#!/bin/bash

# Script to help find Vercel Organization ID

echo "🔍 Finding Vercel Organization ID"
echo "=================================="
echo ""

echo "Method 1: Check Account Settings"
echo "─────────────────────────────────"
echo "1. Go to: https://vercel.com/account"
echo "2. Look for 'Team ID' or 'Organization ID'"
echo ""

echo "Method 2: Check Team Settings (if on a team)"
echo "─────────────────────────────────────────────"
echo "1. Go to: https://vercel.com/teams"
echo "2. Select your team"
echo "3. Go to Settings → General"
echo "4. Look for 'Team ID'"
echo ""

echo "Method 3: Check Project URL"
echo "───────────────────────────"
echo "Your project URL shows the org name:"
echo "https://vercel.com/[ORG-NAME]/[PROJECT-NAME]"
echo "The org name in the URL is your organization"
echo ""

echo "Method 4: Use Vercel CLI (if installed)"
echo "────────────────────────────────────────"
if command -v vercel &> /dev/null; then
    echo "Running: vercel teams ls"
    vercel teams ls 2>/dev/null || echo "Not logged in. Run: vercel login"
else
    echo "Vercel CLI not installed."
    echo "Install with: npm i -g vercel"
fi
echo ""

echo "Method 5: Check API Response"
echo "────────────────────────────"
echo "If you have a VERCEL_TOKEN, you can check via API:"
echo "curl -H 'Authorization: Bearer YOUR_TOKEN' https://api.vercel.com/v2/teams"
echo ""

echo "💡 Note:"
echo "If you're using a personal account (not a team),"
echo "the Organization ID might be your personal account ID."
echo "Check: https://vercel.com/account → General settings"
echo ""




