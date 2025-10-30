#!/bin/bash

# JobBuddy Repository Cleanup Script
# This script organizes documentation and removes clutter

set -e

echo "🧹 Starting JobBuddy Repository Cleanup..."
echo ""

# Create archive directories
echo "📁 Creating archive structure..."
mkdir -p docs/archive/status-reports
mkdir -p docs/archive/deployment-attempts
mkdir -p docs/archive/phase-work
mkdir -p docs/archive/fixes

# Move status reports
echo "📊 Archiving status reports..."
mv -f *-STATUS*.md docs/archive/status-reports/ 2>/dev/null || true
mv -f *-REPORT*.md docs/archive/status-reports/ 2>/dev/null || true
mv -f *-SUMMARY*.md docs/archive/status-reports/ 2>/dev/null || true
mv -f ASSESSMENT*.md docs/archive/status-reports/ 2>/dev/null || true

# Move deployment documentation
echo "🚀 Archiving deployment attempts..."
mv -f GCP-*.md docs/archive/deployment-attempts/ 2>/dev/null || true
mv -f DEPLOY*.md docs/archive/deployment-attempts/ 2>/dev/null || true
mv -f START-GCP*.md docs/archive/deployment-attempts/ 2>/dev/null || true
mv -f NEXT-DEPLOY*.md docs/archive/deployment-attempts/ 2>/dev/null || true
mv -f CLOUD-BUILD*.md docs/archive/deployment-attempts/ 2>/dev/null || true
mv -f README-GCP*.md docs/archive/deployment-attempts/ 2>/dev/null || true

# Move phase work documentation
echo "⚙️ Archiving phase work..."
mv -f PHASE-*.md docs/archive/phase-work/ 2>/dev/null || true
mv -f APPLY-PHASE*.md docs/archive/phase-work/ 2>/dev/null || true
mv -f WORK-COMPLETE*.md docs/archive/phase-work/ 2>/dev/null || true
mv -f IMPLEMENTATION*.md docs/archive/phase-work/ 2>/dev/null || true
mv -f INTEGRATION*.md docs/archive/phase-work/ 2>/dev/null || true

# Move fix documentation
echo "🔧 Archiving fix documentation..."
mv -f FIX-*.md docs/archive/fixes/ 2>/dev/null || true
mv -f FIXES-*.md docs/archive/fixes/ 2>/dev/null || true
mv -f BUGFIX*.md docs/archive/fixes/ 2>/dev/null || true
mv -f BUG-*.md docs/archive/fixes/ 2>/dev/null || true
mv -f URGENT-*.md docs/archive/fixes/ 2>/dev/null || true
mv -f ERROR-*.md docs/archive/fixes/ 2>/dev/null || true
mv -f HOW-TO-RESTORE*.md docs/archive/fixes/ 2>/dev/null || true
mv -f MANUAL-APPLY*.md docs/archive/fixes/ 2>/dev/null || true

# Move miscellaneous documentation
echo "📝 Archiving miscellaneous docs..."
mv -f NEXT-STEPS*.md docs/archive/ 2>/dev/null || true
mv -f CONTINUE-HERE*.md docs/archive/ 2>/dev/null || true
mv -f START-HERE*.md docs/archive/ 2>/dev/null || true
mv -f BUILD-INDEX*.md docs/archive/ 2>/dev/null || true
mv -f DOCS-INDEX*.md docs/archive/ 2>/dev/null || true
mv -f TESTING-*.md docs/archive/ 2>/dev/null || true
mv -f README-concise*.md docs/archive/ 2>/dev/null || true
mv -f README-new*.md docs/archive/ 2>/dev/null || true
mv -f README-ultra*.md docs/archive/ 2>/dev/null || true

# Move structure documentation
echo "🏗️ Archiving structure docs..."
mv -f BACKEND-STRUCTURE*.md docs/archive/ 2>/dev/null || true
mv -f FRONTEND-COMPONENTS*.md docs/archive/ 2>/dev/null || true
mv -f DATABASE-SCHEMA*.md docs/archive/ 2>/dev/null || true

# Move deployment files to scripts
echo "📦 Organizing deployment files..."
mv -f DEPLOY-QUICK-REF.txt docs/archive/deployment-attempts/ 2>/dev/null || true

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📊 Summary:"
echo "  - Status reports → docs/archive/status-reports/"
echo "  - Deployment docs → docs/archive/deployment-attempts/"
echo "  - Phase work → docs/archive/phase-work/"
echo "  - Fix docs → docs/archive/fixes/"
echo ""
echo "📁 Root directory now contains only:"
echo "  - README.md (main documentation)"
echo "  - PROJECT-STATUS.md (current status)"
echo "  - CONTEXT.md (AI context file)"
echo "  - LICENSE"
echo "  - Core config files"
echo ""
echo "🎯 Next: Review PROJECT-STATUS.md for next steps"
