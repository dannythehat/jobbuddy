#!/bin/bash

# Fix Response type conflicts in controllers
# This script updates controllers to use ExpressResponse alias

echo "🔧 Fixing Response type conflicts in controllers..."
echo ""

CONTROLLERS=(
  "backend/src/controllers/applicationController.ts"
  "backend/src/controllers/authController.ts"
  "backend/src/controllers/cvController.ts"
  "backend/src/controllers/jobController.ts"
)

FIXED_COUNT=0

for controller in "${CONTROLLERS[@]}"; do
  if [ -f "$controller" ]; then
    echo "📝 Processing $controller..."
    
    # Check if file needs fixing
    if grep -q "import { Request, Response" "$controller" && ! grep -q "Response as ExpressResponse" "$controller"; then
      # Fix the import statement - handle both with and without NextFunction
      sed -i.bak "s/import { Request, Response }/import { Request, Response as ExpressResponse }/g" "$controller"
      sed -i.bak "s/import { Request, Response, NextFunction }/import { Request, Response as ExpressResponse, NextFunction }/g" "$controller"
      
      # Fix all method signatures
      sed -i.bak "s/res: Response)/res: ExpressResponse)/g" "$controller"
      sed -i.bak "s/res: Response,/res: ExpressResponse,/g" "$controller"
      sed -i.bak "s/res: Response {/res: ExpressResponse {/g" "$controller"
      
      # Remove backup files
      rm -f "${controller}.bak"
      
      echo "✅ Fixed $controller"
      FIXED_COUNT=$((FIXED_COUNT + 1))
    else
      echo "⏭️  Already correct or doesn't need fixing"
    fi
  else
    echo "⚠️  File not found: $controller"
  fi
  echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Complete! Fixed $FIXED_COUNT controller(s)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "1. cd backend"
echo "2. npm install"
echo "3. npx tsc -p tsconfig.json --noEmit"
echo "4. Should show 0 errors ✨"
