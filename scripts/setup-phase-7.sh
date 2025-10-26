#!/bin/bash

# Phase 7 Setup Script
# Runs database migration and sets up encryption key

set -e  # Exit on error

echo "🚀 Phase 7 Setup - Job Board OAuth Integration"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the project root
if [ ! -f "backend/.env.example" ]; then
    echo -e "${RED}❌ Error: Please run this script from the project root directory${NC}"
    exit 1
fi

# Step 1: Check if database is accessible
echo "📊 Step 1: Checking database connection..."
if command -v psql &> /dev/null; then
    # Try to connect to database
    if psql -U postgres -d jobbuddy -c "SELECT 1;" &> /dev/null; then
        echo -e "${GREEN}✅ Database connection successful${NC}"
    else
        echo -e "${YELLOW}⚠️  Warning: Could not connect to database${NC}"
        echo "   Make sure PostgreSQL is running and jobbuddy database exists"
        echo "   You may need to run: createdb -U postgres jobbuddy"
        read -p "   Continue anyway? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
else
    echo -e "${YELLOW}⚠️  psql not found in PATH. Skipping database check.${NC}"
fi

# Step 2: Run database migration
echo ""
echo "📦 Step 2: Running Phase 7 database migration..."
if [ -f "migrations/007_job_board_integrations.sql" ]; then
    if psql -U postgres -d jobbuddy -f migrations/007_job_board_integrations.sql &> /dev/null; then
        echo -e "${GREEN}✅ Migration completed successfully${NC}"
        
        # Verify migration
        COUNT=$(psql -U postgres -d jobbuddy -t -c "SELECT COUNT(*) FROM job_board_providers;" 2>/dev/null | tr -d ' ')
        if [ "$COUNT" = "12" ]; then
            echo -e "${GREEN}✅ Verified: 12 job board providers inserted${NC}"
        else
            echo -e "${YELLOW}⚠️  Warning: Expected 12 providers, found $COUNT${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Migration may have already been run or encountered an error${NC}"
        echo "   This is usually safe to ignore if tables already exist"
    fi
else
    echo -e "${RED}❌ Migration file not found: migrations/007_job_board_integrations.sql${NC}"
    exit 1
fi

# Step 3: Generate and add encryption key
echo ""
echo "🔐 Step 3: Setting up encryption key..."

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  backend/.env not found. Creating from .env.example...${NC}"
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✅ Created backend/.env${NC}"
fi

# Check if ENCRYPTION_KEY already exists
if grep -q "^ENCRYPTION_KEY=" backend/.env; then
    CURRENT_KEY=$(grep "^ENCRYPTION_KEY=" backend/.env | cut -d '=' -f2)
    if [ "$CURRENT_KEY" != "your_encryption_key_here_64_characters_hex" ] && [ ! -z "$CURRENT_KEY" ]; then
        echo -e "${GREEN}✅ ENCRYPTION_KEY already configured${NC}"
    else
        # Generate new key
        NEW_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
        sed -i.bak "s/^ENCRYPTION_KEY=.*/ENCRYPTION_KEY=$NEW_KEY/" backend/.env
        echo -e "${GREEN}✅ Generated and added new ENCRYPTION_KEY${NC}"
        rm backend/.env.bak 2>/dev/null || true
    fi
else
    # Add encryption key
    NEW_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    echo "" >> backend/.env
    echo "# Phase 7: OAuth Token Encryption" >> backend/.env
    echo "ENCRYPTION_KEY=$NEW_KEY" >> backend/.env
    echo -e "${GREEN}✅ Generated and added ENCRYPTION_KEY to .env${NC}"
fi

# Step 4: Verify setup
echo ""
echo "🔍 Step 4: Verifying Phase 7 setup..."

# Check if routes are integrated
if grep -q "jobBoardRoutes" backend/src/app.ts && grep -q "oauthRoutes" backend/src/app.ts; then
    echo -e "${GREEN}✅ Routes integrated in app.ts${NC}"
else
    echo -e "${RED}❌ Routes not found in app.ts${NC}"
    echo "   This should have been done automatically. Please check the commit."
fi

# Check if migration tables exist
TABLES_EXIST=$(psql -U postgres -d jobbuddy -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_name IN ('job_board_providers', 'user_job_board_connections', 'job_board_jobs', 'job_search_history');" 2>/dev/null | tr -d ' ')
if [ "$TABLES_EXIST" = "4" ]; then
    echo -e "${GREEN}✅ All 4 Phase 7 tables created${NC}"
else
    echo -e "${YELLOW}⚠️  Warning: Expected 4 tables, found $TABLES_EXIST${NC}"
fi

# Summary
echo ""
echo "================================================"
echo -e "${GREEN}🎉 Phase 7 Setup Complete!${NC}"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Start the backend server: cd backend && npm run dev"
echo "2. Test the endpoints:"
echo "   curl http://localhost:3001/api/job-boards/providers"
echo "   curl http://localhost:3001/api/health"
echo ""
echo "Available job boards:"
echo "  - LinkedIn, Indeed, Glassdoor, ZipRecruiter"
echo "  - Monster, CareerBuilder, Dice, Naukri"
echo "  - Seek, Reed, Totaljobs, StepStone"
echo ""
echo "Documentation: docs/phase-7.1-implementation.md"
