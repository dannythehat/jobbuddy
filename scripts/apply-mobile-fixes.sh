#!/bin/bash
# Apply mobile-first fixes to JobBuddy frontend

echo "🔧 Applying mobile-first fixes..."

# Apply header patch
echo "📱 Fixing Header component..."
cd frontend/src/components/Layout
git apply ../../../../patches/mobile-first-header.patch

echo "✅ Mobile-first fixes applied!"
echo ""
echo "📋 Changes made:"
echo "  ✓ Responsive typography in theme"
echo "  ✓ Touch-friendly button sizes (44x44px minimum)"
echo "  ✓ Improved mobile header visibility"
echo "  ✓ Better hamburger menu styling"
echo "  ✓ Responsive button text (Register/Sign Up)"
echo ""
echo "🧪 Test on mobile devices:"
echo "  - Chrome DevTools (F12 > Toggle device toolbar)"
echo "  - iPhone SE (375px)"
echo "  - iPad (768px)"
echo "  - Desktop (1200px+)"
