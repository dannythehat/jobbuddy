#!/bin/bash

# Restore JobsPage.tsx to original clean version before manual edits

echo "Restoring JobsPage.tsx to last known good version..."

# Restore from commit 6de047d (last good version before manual edits)
git checkout 6de047d30848b6024a4bf18cb6ea489b4833180b -- frontend/src/pages/JobsPage.tsx

echo "✅ JobsPage.tsx restored to original clean version (652 lines)"
echo ""
echo "File is now back to the state before manual edits."
echo "Ready for proper integration of NaturalLanguageSearch component."
echo ""
echo "Next steps:"
echo "1. Review the restored file"
echo "2. Commit this restoration: git add frontend/src/pages/JobsPage.tsx"
echo "3. Commit: git commit -m 'Restore JobsPage.tsx to clean version'"
echo "4. Push: git push"
