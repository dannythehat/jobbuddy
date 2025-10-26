#!/bin/bash

# JobBuddi Setup Verification Script
# Checks if all required files and configurations are in place

echo "🔍 JobBuddi Setup Verification"
echo "================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check function
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 ${RED}(MISSING)${NC}"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        return 0
    else
        echo -e "${RED}✗${NC} $1/ ${RED}(MISSING)${NC}"
        return 1
    fi
}

errors=0

echo "📁 Checking Frontend Files..."
check_file "frontend/public/index.html" || ((errors++))
check_file "frontend/public/manifest.json" || ((errors++))
check_file "frontend/public/robots.txt" || ((errors++))
check_file "frontend/Dockerfile" || ((errors++))
check_file "frontend/nginx.conf" || ((errors++))
check_file "frontend/.dockerignore" || ((errors++))
check_file "frontend/.env.example" || ((errors++))
check_file "frontend/package.json" || ((errors++))
check_file "frontend/tsconfig.json" || ((errors++))
echo ""

echo "📁 Checking Backend Files..."
check_file "backend/Dockerfile" || ((errors++))
check_file "backend/.dockerignore" || ((errors++))
check_file "backend/.env.example" || ((errors++))
check_file "backend/package.json" || ((errors++))
check_file "backend/tsconfig.json" || ((errors++))
check_file "backend/src/server.ts" || ((errors++))
check_file "backend/src/app.ts" || ((errors++))
echo ""

echo "📁 Checking Docker Configuration..."
check_file "docker-compose.prod.yml" || ((errors++))
check_file ".env.production.example" || ((errors++))
echo ""

echo "📁 Checking Documentation..."
check_file "README.md" || ((errors++))
check_file "BUGFIXES.md" || ((errors++))
check_file "LICENSE" || ((errors++))
echo ""

echo "📦 Checking Node Modules..."
if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Backend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Backend dependencies not installed (run: cd backend && npm install)"
fi

if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Frontend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Frontend dependencies not installed (run: cd frontend && npm install)"
fi
echo ""

echo "🔐 Checking Environment Files..."
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓${NC} Backend .env configured"
else
    echo -e "${YELLOW}⚠${NC} Backend .env not found (copy from .env.example)"
fi

if [ -f "frontend/.env" ]; then
    echo -e "${GREEN}✓${NC} Frontend .env configured"
else
    echo -e "${YELLOW}⚠${NC} Frontend .env not found (copy from .env.example)"
fi
echo ""

echo "================================"
if [ $errors -eq 0 ]; then
    echo -e "${GREEN}✅ All critical files present!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Configure environment: cp backend/.env.example backend/.env"
    echo "2. Install dependencies: cd backend && npm install"
    echo "3. Start development: npm run dev"
else
    echo -e "${RED}❌ Found $errors missing file(s)${NC}"
    echo "Please check the errors above and ensure all files are present."
fi
echo ""
