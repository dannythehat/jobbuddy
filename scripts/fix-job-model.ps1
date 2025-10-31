# PowerShell script to fix Job model status -> isActive
# Run this from the project root directory

Write-Host "Fixing Job model references from 'status' to 'isActive'..." -ForegroundColor Yellow

# Fix jobMatcher.ts
$jobMatcherPath = "backend/src/services/jobMatcher.ts"
if (Test-Path $jobMatcherPath) {
    $content = Get-Content $jobMatcherPath -Raw
    $content = $content -replace "status: 'active'", "isActive: true"
    Set-Content $jobMatcherPath $content -NoNewline
    Write-Host "✓ Fixed $jobMatcherPath" -ForegroundColor Green
} else {
    Write-Host "✗ File not found: $jobMatcherPath" -ForegroundColor Red
}

# Fix jobController.ts
$jobControllerPath = "backend/src/controllers/jobController.ts"
if (Test-Path $jobControllerPath) {
    $lines = Get-Content $jobControllerPath
    
    # Fix specific lines (array is 0-indexed, so subtract 1 from line numbers)
    $linesToFix = @(61, 155, 170, 185, 200, 215, 235, 243, 253)
    
    foreach ($lineNum in $linesToFix) {
        if ($lines[$lineNum] -match "status: 'active'") {
            $lines[$lineNum] = $lines[$lineNum] -replace "status: 'active'", "isActive: true"
            Write-Host "  ✓ Fixed line $($lineNum + 1)" -ForegroundColor Cyan
        }
    }
    
    Set-Content $jobControllerPath $lines
    Write-Host "✓ Fixed $jobControllerPath" -ForegroundColor Green
} else {
    Write-Host "✗ File not found: $jobControllerPath" -ForegroundColor Red
}

Write-Host "`nAll fixes applied successfully!" -ForegroundColor Green
Write-Host "Review the changes and commit when ready." -ForegroundColor Yellow
