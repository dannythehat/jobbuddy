# 🚀 GCP Deployment Guide (PowerShell)

**For Windows users with PowerShell**

---

## 📋 Prerequisites

### Required Tools
```powershell
# Check Node.js
node --version  # Should be >= 18.0.0

# Check npm
npm --version   # Should be >= 8.0.0

# Check gcloud CLI
gcloud --version

# Check Git
git --version
```

### Install gcloud CLI (if needed)
1. Download: https://cloud.google.com/sdk/docs/install
2. Run installer
3. Restart PowerShell
4. Initialize: `gcloud init`

---

## 🎯 Deployment Steps (PowerShell)

### Step 1: GCP Permissions (15 min)
```powershell
# Navigate to project root
cd C:\path\to\jobbuddy

# Run permission script (requires gcloud CLI)
.\scripts\fix-gcp-permissions.ps1

# This will:
# - Set GCP project
# - Grant permissions
# - Create service account
# - Generate key file
```

### Step 2: Create GCP Secrets (10 min)
```powershell
# Run secrets creation script
.\scripts\create-secrets.ps1

# You'll be prompted for:
# - Database password
# - JWT secret
# - OpenAI API key
# - Encryption key
```

### Step 3: Add GitHub Secret (5 min)
```powershell
# Copy service account key
Get-Content github-actions-key.json | Set-Clipboard

# Or view it
Get-Content github-actions-key.json
```

Then:
1. Go to: https://github.com/dannythehat/jobbuddy/settings/secrets/actions
2. Click "New repository secret"
3. Name: `GCP_SA_KEY`
4. Paste the key content
5. Click "Add secret"

### Step 4: Deploy (10-15 min)
```powershell
# Commit any pending changes
git add .
git commit -m "Ready for GCP deployment"

# Push to trigger deployment
git push origin main

# Monitor deployment
# Go to: https://github.com/dannythehat/jobbuddy/actions
```

### Step 5: Validate (5 min)
```powershell
# Run validation script
.\scripts\validate-deployment.ps1

# Or manually check
Start-Process "https://jobbuddy-frontend-*.a.run.app"
```

---

## 🔧 PowerShell-Specific Commands

### Environment Variables
```powershell
# Set temporarily (current session)
$env:NODE_ENV = "production"
$env:GCP_PROJECT = "algebraic-link-476405-e9"

# View
$env:NODE_ENV

# Set permanently (user level)
[System.Environment]::SetEnvironmentVariable("NODE_ENV", "production", "User")
```

### File Operations
```powershell
# View file
Get-Content filename.txt

# Edit file
notepad filename.txt

# Search in files
Select-String -Path "*.tsx" -Pattern "mobile"

# Copy file
Copy-Item source.txt destination.txt
```

### Git Operations
```powershell
# Status
git status

# Add all
git add .

# Commit
git commit -m "Your message"

# Push
git push origin main

# Pull
git pull origin main

# View log
git log --oneline -10
```

---

## 🐛 Troubleshooting (PowerShell)

### Script Execution Policy
```powershell
# Check current policy
Get-ExecutionPolicy

# Allow scripts (run as Administrator)
Set-ExecutionPolicy RemoteSigned

# Or bypass for single script
PowerShell -ExecutionPolicy Bypass -File .\script.ps1
```

### Port Already in Use
```powershell
# Find process on port 3000
Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess

# Kill process
Stop-Process -Id <ProcessId> -Force
```

### Node Modules Issues
```powershell
# Clean install
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### gcloud Not Found
```powershell
# Add to PATH (run as Administrator)
$env:Path += ";C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin"

# Or permanently
[System.Environment]::SetEnvironmentVariable(
    "Path",
    $env:Path + ";C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin",
    "Machine"
)
```

---

## 📊 Deployment Checklist

### Pre-Deployment
- [ ] gcloud CLI installed and configured
- [ ] Node.js >= 18.0.0 installed
- [ ] Git configured
- [ ] All tests passing locally
- [ ] Environment variables documented

### During Deployment
- [ ] GCP permissions configured
- [ ] Secrets created in GCP
- [ ] GitHub secret added
- [ ] Code pushed to main branch
- [ ] GitHub Actions workflow running

### Post-Deployment
- [ ] Backend health check passing
- [ ] Frontend accessible
- [ ] Database connected
- [ ] Authentication working
- [ ] API endpoints functional

---

## 🎯 Quick Commands Reference

| Task | PowerShell Command |
|------|-------------------|
| Fix GCP permissions | `.\scripts\fix-gcp-permissions.ps1` |
| Create secrets | `.\scripts\create-secrets.ps1` |
| Validate deployment | `.\scripts\validate-deployment.ps1` |
| Apply mobile fixes | `.\scripts\apply-mobile-fixes.ps1` |
| Start dev server | `cd frontend; npm start` |
| Run tests | `npm test` |
| Build production | `npm run build` |
| View logs | `Get-Content -Tail 50 -Wait logfile.log` |

---

## 📱 Mobile Fixes (PowerShell)

Before deploying, apply mobile-first fixes:

```powershell
# Apply mobile fixes
.\scripts\apply-mobile-fixes.ps1

# Test locally
cd frontend
npm start

# Open in browser
Start-Process "http://localhost:3000"

# Test in Chrome DevTools (F12 > Ctrl+Shift+M)
```

---

## 🔗 Related Documentation

- [Main Deployment Guide](PHASE-6.2-DEPLOYMENT.md)
- [PowerShell Commands Reference](POWERSHELL-COMMANDS.md)
- [Mobile-First Fixes](MOBILE-FIRST-FIXES.md)
- [Deployment Status](../DEPLOYMENT-STATUS.md)

---

## 💡 Tips for PowerShell Users

1. **Use tab completion** - Type partial command and press Tab
2. **Use aliases** - `ls` = `Get-ChildItem`, `cd` = `Set-Location`
3. **Pipe commands** - `Get-Process | Where-Object {$_.CPU -gt 100}`
4. **History** - Press Up/Down arrows or `Get-History`
5. **Clear screen** - `cls` or `Clear-Host`
6. **Copy output** - `command | Set-Clipboard`

---

**Last Updated:** October 31, 2025  
**For:** Windows PowerShell users  
**Project:** algebraic-link-476405-e9 (europe-west1)
