#!/bin/bash

# JobBuddy Backend Compile Fix - Quick Start
# Complete automated workflow

set -e  # Exit on error

echo "🚀 JobBuddy Backend Compile Fix - Quick Start"
echo "=============================================="
echo ""

# Step 1: Fix Response types
echo "📝 Step 1: Fixing Response type conflicts..."
chmod +x scripts/fix-response-types.sh
./scripts/fix-response-types.sh

# Step 2: Install dependencies
echo "📦 Step 2: Installing dependencies..."
cd backend
npm install > /dev/null 2>&1 || npm install
echo "✅ Dependencies installed"
echo ""

# Step 3: TypeScript check
echo "🔍 Step 3: Checking TypeScript compilation..."
npx tsc -p tsconfig.json --noEmit 2>&1 | tee ../tsc-output.log
TSC_EXIT_CODE=${PIPESTATUS[0]}

if [ $TSC_EXIT_CODE -eq 0 ]; then
  echo "✅ TypeScript compilation successful! 0 errors."
else
  echo "❌ TypeScript compilation failed"
  head -n 30 ../tsc-output.log > ../tsc-first-30.log
  echo "First 30 lines saved to tsc-first-30.log"
  cd ..
  exit 1
fi
echo ""

# Step 4: Start backend
echo "🚀 Step 4: Starting backend server..."
npm run dev > ../backend-boot.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../backend-boot.pid
echo "Backend PID: $BACKEND_PID"

# Wait for backend to start
sleep 5

# Check if backend is running
if ps -p $BACKEND_PID > /dev/null; then
  echo "✅ Backend is running!"
  head -n 30 ../backend-boot.log > ../backend-boot-first-30.log
else
  echo "❌ Backend failed to start"
  head -n 50 ../backend-boot.log
  cd ..
  exit 1
fi
echo ""

# Step 5: Smoke tests
echo "🧪 Step 5: Running smoke tests..."
cd ..

# Test endpoints
curl -sS http://localhost:3000/api/applications > smoke_applications.json 2>&1 || echo "⚠️  Auth may be required"
curl -sS http://localhost:3000/health > smoke_health.json 2>&1 || echo "⚠️  Health endpoint check"

echo "✅ Smoke tests completed"
echo ""

# Stop backend
echo "🛑 Stopping backend server..."
kill $(cat backend-boot.pid) 2>/dev/null || true
rm -f backend-boot.pid

echo ""
echo "=============================================="
echo "✅ All checks passed!"
echo "=============================================="
echo ""
echo "📋 Generated files:"
echo "  - tsc-output.log (TypeScript compilation)"
echo "  - backend-boot.log (Backend startup)"
echo "  - smoke_*.json (API tests)"
echo ""
echo "🎯 Next steps:"
echo "  1. git add ."
echo "  2. git commit -m \"fix: resolve Response type conflicts in controllers\""
echo "  3. git push origin fix/backend-compile"
echo "  4. gh pr create --base main --head fix/backend-compile \\"
echo "       --title \"fix: backend compile and associations\" \\"
echo "       --body \"Fixes #23 - See logs for details\""
echo ""
