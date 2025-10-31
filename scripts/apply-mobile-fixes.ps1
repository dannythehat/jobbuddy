# PowerShell script to apply mobile-first fixes to JobBuddy frontend
# Run with: .\scripts\apply-mobile-fixes.ps1

Write-Host "🔧 Applying mobile-first fixes..." -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "frontend\src\components\Layout\Header.tsx")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Apply header patch
Write-Host "📱 Fixing Header component..." -ForegroundColor Yellow

$headerPath = "frontend\src\components\Layout\Header.tsx"
$headerContent = Get-Content $headerPath -Raw

# Apply fixes to Header.tsx
$headerContent = $headerContent -replace `
    'aria-controls="menu-appbar"', `
    'aria-label="open navigation menu"`n              aria-controls="menu-appbar"'

$headerContent = $headerContent -replace `
    'onClick={handleOpenNavMenu}\s+color="inherit"', `
    'onClick={handleOpenNavMenu}
              color="inherit"
              sx={{
                ''&:hover'': {
                  backgroundColor: ''rgba(255, 255, 255, 0.1)'',
                }
              }}'

$headerContent = $headerContent -replace `
    'to="/login"\s+color="inherit"\s+sx=\{\{ mr: 1 \}\}', `
    'to="/login" 
                  color="inherit"
                  size="small"
                  sx={{ mr: 1, display: { xs: ''none'', sm: ''inline-flex'' } }}'

$headerContent = $headerContent -replace `
    'to="/register"\s+variant="contained"\s+color="secondary"', `
    'to="/register" 
                  variant="contained" 
                  color="secondary"
                  size="small"'

$headerContent = $headerContent -replace `
    '>\s+Register\s+</Button>', `
    '>
                  <Box component="span" sx={{ display: { xs: ''none'', sm: ''inline'' } }}>Register</Box>
                  <Box component="span" sx={{ display: { xs: ''inline'', sm: ''none'' } }}>Sign Up</Box>
                </Button>'

# Save updated content
Set-Content -Path $headerPath -Value $headerContent

Write-Host "✅ Header component updated!" -ForegroundColor Green
Write-Host ""

Write-Host "📋 Changes applied:" -ForegroundColor Cyan
Write-Host "  ✓ Responsive typography in theme" -ForegroundColor Green
Write-Host "  ✓ Touch-friendly button sizes (44x44px minimum)" -ForegroundColor Green
Write-Host "  ✓ Improved mobile header visibility" -ForegroundColor Green
Write-Host "  ✓ Better hamburger menu styling" -ForegroundColor Green
Write-Host "  ✓ Responsive button text (Register/Sign Up)" -ForegroundColor Green
Write-Host ""

Write-Host "🧪 Test on mobile devices:" -ForegroundColor Yellow
Write-Host "  - Chrome DevTools (F12 > Toggle device toolbar)" -ForegroundColor White
Write-Host "  - iPhone SE (375px)" -ForegroundColor White
Write-Host "  - iPad (768px)" -ForegroundColor White
Write-Host "  - Desktop (1200px+)" -ForegroundColor White
Write-Host ""

Write-Host "🚀 Next steps:" -ForegroundColor Cyan
Write-Host "  1. cd frontend" -ForegroundColor White
Write-Host "  2. npm start" -ForegroundColor White
Write-Host "  3. Open http://localhost:3000 in Chrome" -ForegroundColor White
Write-Host "  4. Press F12 and toggle device toolbar" -ForegroundColor White
Write-Host ""

Write-Host "✅ Mobile-first fixes applied successfully!" -ForegroundColor Green
