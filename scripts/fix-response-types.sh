#!/bin/bash
# Fix Response type conflicts in controllers
# This script replaces "Response" with "ExpressResponse" in controller files

echo "Fixing Response type conflicts in controllers..."

# Fix applicationController.ts
echo "Fixing applicationController.ts..."
sed -i.bak 's/import { Request, Response } from '\''express'\'';/import { Request, Response as ExpressResponse } from '\''express'\'';/' backend/src/controllers/applicationController.ts
sed -i.bak 's/res: Response)/res: ExpressResponse)/g' backend/src/controllers/applicationController.ts

# Fix other controllers that might have the same issue
for file in backend/src/controllers/*.ts; do
    if grep -q "import { Request, Response } from 'express'" "$file" && grep -q "from '../models/Response'" "$file"; then
        echo "Fixing $file..."
        sed -i.bak "s/import { Request, Response } from 'express';/import { Request, Response as ExpressResponse } from 'express';/" "$file"
        sed -i.bak 's/res: Response)/res: ExpressResponse)/g' "$file"
    fi
done

# Clean up backup files
find backend/src/controllers -name "*.bak" -delete

echo "✅ Response type conflicts fixed!"
echo "Run 'npx tsc -p backend/tsconfig.json --noEmit' to verify"
