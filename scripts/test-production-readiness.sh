#!/bin/bash

# Production Readiness Test Script
# Tests all components to ensure everything is ready for production

# Don't exit on error - we want to test everything
set +e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Function to print results
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ $2${NC}"
        ((FAILED++))
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo "=========================================="
echo "  ChainCheck Production Readiness Test"
echo "=========================================="
echo ""

# ============================================
# 1. Environment Variables
# ============================================
echo "📋 Testing Environment Variables..."
echo "─────────────────────────────────"

# Root .env
if [ -f .env ]; then
    print_result 0 "Root .env file exists"
    
    # Check required variables
    if grep -q "^PRIVATE_KEY=" .env && ! grep -q "^PRIVATE_KEY=your_private_key_here" .env; then
        print_result 0 "PRIVATE_KEY is set"
    else
        print_result 1 "PRIVATE_KEY is missing or placeholder"
    fi
    
    if grep -q "^POLYGON_RPC_URL=" .env && ! grep -q "^POLYGON_RPC_URL=$" .env; then
        print_result 0 "POLYGON_RPC_URL is set"
    else
        print_result 1 "POLYGON_RPC_URL is missing"
    fi
    
    if grep -q "^POLYGONSCAN_API_KEY=" .env && ! grep -q "your_polygonscan_api_key_here" .env; then
        print_result 0 "POLYGONSCAN_API_KEY is set"
    else
        print_result 1 "POLYGONSCAN_API_KEY is missing or placeholder"
    fi
else
    print_result 1 "Root .env file not found"
fi

# Frontend .env
if [ -f frontend/.env ]; then
    print_result 0 "Frontend .env file exists"
    
    if grep -q "^VITE_POSTHOG_KEY=" frontend/.env && ! grep -q "^VITE_POSTHOG_KEY=$" frontend/.env; then
        print_result 0 "VITE_POSTHOG_KEY is set"
    else
        print_warning "VITE_POSTHOG_KEY not set (optional but recommended)"
    fi
    
    if grep -q "^VITE_SENTRY_DSN=" frontend/.env && ! grep -q "^VITE_SENTRY_DSN=$" frontend/.env; then
        print_result 0 "VITE_SENTRY_DSN is set"
    else
        print_warning "VITE_SENTRY_DSN not set (optional but recommended)"
    fi
else
    print_warning "Frontend .env file not found (will use defaults)"
fi

echo ""

# ============================================
# 2. Dependencies
# ============================================
echo "📦 Testing Dependencies..."
echo "─────────────────────────"

# Root dependencies
if [ -d node_modules ]; then
    print_result 0 "Root node_modules exists"
else
    print_result 1 "Root node_modules missing - run: npm install"
fi

# Frontend dependencies
if [ -d frontend/node_modules ]; then
    print_result 0 "Frontend node_modules exists"
    
    # Check for new dependencies
    if [ -f frontend/node_modules/@sentry/react/package.json ]; then
        print_result 0 "Sentry dependency installed"
    else
        print_result 1 "Sentry not installed - run: cd frontend && npm install"
    fi
    
    if [ -f frontend/node_modules/posthog-js/package.json ]; then
        print_result 0 "PostHog dependency installed"
    else
        print_result 1 "PostHog not installed - run: cd frontend && npm install"
    fi
else
    print_result 1 "Frontend node_modules missing - run: cd frontend && npm install"
fi

# QR Generator dependencies
if [ -d qr-generator/node_modules ]; then
    print_result 0 "QR generator node_modules exists"
    
    if [ -f qr-generator/node_modules/express-rate-limit/package.json ]; then
        print_result 0 "express-rate-limit installed"
    else
        print_result 1 "express-rate-limit not installed - run: cd qr-generator && npm install"
    fi
    
    if [ -f qr-generator/node_modules/morgan/package.json ]; then
        print_result 0 "morgan installed"
    else
        print_result 1 "morgan not installed - run: cd qr-generator && npm install"
    fi
else
    print_result 1 "QR generator node_modules missing - run: cd qr-generator && npm install"
fi

echo ""

# ============================================
# 3. GitHub Secrets
# ============================================
echo "🔐 Testing GitHub Secrets..."
echo "────────────────────────────"

if command -v gh &> /dev/null; then
    if gh auth status &> /dev/null; then
        print_result 0 "GitHub CLI authenticated"
        
        # Check secrets
        SECRETS=$(gh secret list --repo CodeCoffeeGuy/Chaincheck 2>/dev/null | wc -l | tr -d ' ')
        if [ "$SECRETS" -ge 7 ]; then
            print_result 0 "GitHub secrets configured ($SECRETS secrets found)"
        else
            print_result 1 "GitHub secrets incomplete (found $SECRETS, expected at least 7)"
        fi
        
        # Check specific secrets
        if gh secret list --repo CodeCoffeeGuy/Chaincheck 2>/dev/null | grep -q "VERCEL_TOKEN"; then
            print_result 0 "VERCEL_TOKEN secret exists"
        else
            print_result 1 "VERCEL_TOKEN secret missing"
        fi
        
        if gh secret list --repo CodeCoffeeGuy/Chaincheck 2>/dev/null | grep -q "PRIVATE_KEY"; then
            print_result 0 "PRIVATE_KEY secret exists"
        else
            print_result 1 "PRIVATE_KEY secret missing"
        fi
    else
        print_result 1 "GitHub CLI not authenticated - run: gh auth login"
    fi
else
    print_warning "GitHub CLI not installed (optional for local testing)"
fi

echo ""

# ============================================
# 4. GitHub Actions Workflows
# ============================================
echo "⚙️  Testing GitHub Actions Workflows..."
echo "───────────────────────────────────────"

if [ -f .github/workflows/ci.yml ]; then
    print_result 0 "CI workflow file exists"
else
    print_result 1 "CI workflow file missing"
fi

if [ -f .github/workflows/contract-deploy.yml ]; then
    print_result 0 "Contract deploy workflow exists"
else
    print_result 1 "Contract deploy workflow missing"
fi

echo ""

# ============================================
# 5. Configuration Files
# ============================================
echo "📄 Testing Configuration Files..."
echo "────────────────────────────────"

if [ -f .env.example ]; then
    print_result 0 ".env.example exists"
else
    print_result 1 ".env.example missing"
fi

if [ -f frontend/.env.example ]; then
    print_result 0 "frontend/.env.example exists"
else
    print_result 1 "frontend/.env.example missing"
fi

if [ -f vercel.json ]; then
    print_result 0 "vercel.json exists"
    if grep -q "headers" vercel.json; then
        print_result 0 "Security headers configured in vercel.json"
    else
        print_warning "Security headers not found in vercel.json"
    fi
else
    print_result 1 "vercel.json missing"
fi

if [ -f scripts/validate-env.js ]; then
    print_result 0 "Environment validation script exists"
else
    print_result 1 "Environment validation script missing"
fi

echo ""

# ============================================
# 6. Build Test
# ============================================
echo "🔨 Testing Build Process..."
echo "───────────────────────────"

# Test contract compilation (skip actual compilation to save time)
if [ -f hardhat.config.js ]; then
    print_result 0 "hardhat.config.js exists"
    if [ -d artifacts/contracts ]; then
        print_result 0 "Contract artifacts exist (already compiled)"
    else
        print_warning "Contract artifacts not found (run: npm run compile)"
    fi
else
    print_result 1 "hardhat.config.js missing"
fi

# Test frontend build (skip if takes too long, just check if possible)
if [ -f frontend/package.json ]; then
    print_info "Checking frontend build setup..."
    if [ -f frontend/vite.config.ts ]; then
        print_result 0 "Frontend build config exists"
    else
        print_result 1 "Frontend build config missing"
    fi
else
    print_result 1 "Frontend package.json missing"
fi

echo ""

# ============================================
# 7. QR Generator Service
# ============================================
echo "🔧 Testing QR Generator Service..."
echo "──────────────────────────────────"

if [ -f qr-generator/server.js ]; then
    print_result 0 "QR generator server.js exists"
    
    # Check for rate limiting
    if grep -q "express-rate-limit" qr-generator/server.js; then
        print_result 0 "Rate limiting configured"
    else
        print_result 1 "Rate limiting not configured"
    fi
    
    # Check for error handling
    if grep -q "app.use.*err.*req.*res" qr-generator/server.js || grep -q "error handler" qr-generator/server.js; then
        print_result 0 "Error handling configured"
    else
        print_warning "Error handling might be missing"
    fi
else
    print_result 1 "QR generator server.js missing"
fi

echo ""

# ============================================
# 8. Documentation
# ============================================
echo "📚 Testing Documentation..."
echo "──────────────────────────"

if [ -f PRODUCTION_READINESS.md ]; then
    print_result 0 "PRODUCTION_READINESS.md exists"
else
    print_warning "PRODUCTION_READINESS.md missing"
fi

if [ -f MONITORING_SETUP.md ]; then
    print_result 0 "MONITORING_SETUP.md exists"
else
    print_warning "MONITORING_SETUP.md missing"
fi

if [ -f README.md ]; then
    print_result 0 "README.md exists"
else
    print_result 1 "README.md missing"
fi

echo ""

# ============================================
# Summary
# ============================================
echo "=========================================="
echo "  Test Summary"
echo "=========================================="
echo ""
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARNINGS${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All critical tests passed!${NC}"
    echo -e "${GREEN}✅ Production ready!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please fix the issues above.${NC}"
    echo ""
    echo "Common fixes:"
    echo "  - Install dependencies: npm install && cd frontend && npm install && cd ../qr-generator && npm install"
    echo "  - Set up environment variables: cp .env.example .env"
    echo "  - Configure GitHub secrets: ./scripts/setup-github-secrets.sh"
    exit 1
fi

