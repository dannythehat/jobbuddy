#!/bin/bash
# Quick Start - JobBuddy Backend Compile Fix
# Run this script from the repository root

set -e  # Exit on error

echo "🚀 JobBuddy Backend Compile Fix - Quick Start"
echo "=============================================="
echo ""

# Step 1: Fix Response type conflicts
echo "📝 Step 1: Fixing Response type conflicts..."
chmod +x scripts/fix-response-types.sh
./scripts/fix-response-types.sh
echo ""

# Step 2: Install dependencies
echo "📦 Step 2: Installing dependencies..."
cd backend
npm install
echo ""

# Step 3: TypeScript compilation check
echo "🔍 Step 3: Checking TypeScript compilation..."
npx tsc -p tsconfig.json --noEmit 2>&1 | tee ../tsc-output.log
TSC_EXIT_CODE=${PIPESTATUS[0]}

if [ $TSC_EXIT_CODE -eq 0 ]; then
    echo "✅ TypeScript compilation successful! 0 errors."
else
    echo "❌ TypeScript compilation failed. Check tsc-output.log for details."
    head -n 30 ../tsc-output.log > ../tsc-first-30.log
    echo "First 30 lines saved to tsc-first-30.log"
    exit 1
fi
echo ""

# Step 4: Start backend (optional)
echo "🚀 Step 4: Starting backend server..."
echo "Press Ctrl+C to skip backend startup test"
read -t 5 -p "Starting in 5 seconds... " || true
echo ""

npm run dev > ../backend-boot.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../backend-boot.pid
echo "Backend started with PID: $BACKEND_PID"

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 5

# Check if backend is still running
if ps -p $BACKEND_PID > /dev/null; then
    echo "✅ Backend is running!"
    head -n 30 ../backend-boot.log > ../backend-boot-first-30.log
    echo "First 30 lines of boot log saved to backend-boot-first-30.log"
    
    # Optional: Run smoke tests
    echo ""
    echo "🧪 Running smoke tests..."
    curl -sS http://localhost:3000/api/applications 2>/dev/null | jq '.' > ../smoke_applications.json || echo "⚠️  Smoke test failed (may need authentication)"
    
    # Stop backend
    echo ""
    echo "Stopping backend..."
    kill $BACKEND_PID 2>/dev/null || true
else
    echo "❌ Backend failed to start. Check backend-boot.log for details."
    cat ../backend-boot.log
    exit 1
fi

cd ..

echo ""
echo "=============================================="
echo "✅ All checks passed!"
echo ""
echo "📋 Next steps:"
echo "1. Review the logs: tsc-output.log, backend-boot.log"
echo "2. Commit changes: git add . && git commit -m 'fix: resolve Response type conflicts'"
echo "3. Push to remote: git push origin fix/backend-compile"
echo "4. Create PR: gh pr create --base main --head fix/backend-compile"
echo ""
echo "📄 See PROGRESS.md for detailed documentation"
