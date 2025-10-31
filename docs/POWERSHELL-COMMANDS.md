# PowerShell Commands for JobBuddy

## 🚀 Quick Start (PowerShell)

### Development
```powershell
# Start backend
cd backend
npm install
npm run dev

# Start frontend (new terminal)
cd frontend
npm install
npm start
```

### Apply Mobile Fixes
```powershell
# From project root
.\scripts\apply-mobile-fixes.ps1
```

### GCP Deployment
```powershell
# Fix GCP permissions (requires gcloud CLI)
.\scripts\fix-gcp-permissions.ps1

# Create GCP secrets
.\scripts\create-secrets.ps1

# Deploy
git push origin main
```

### Testing
```powershell
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test

# Lint
npm run lint
```

### Build
```powershell
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build
```

## 📱 Mobile Testing (PowerShell)

```powershell
# Start dev server
cd frontend
npm start

# Open browser
Start-Process "http://localhost:3000"

# Then press F12 in Chrome and toggle device toolbar (Ctrl+Shift+M)
```

## 🔧 Common PowerShell Commands

### File Operations
```powershell
# Make script executable (not needed in PowerShell)
# Just run: .\script-name.ps1

# View file content
Get-Content filename.txt

# Search in files
Select-String -Path "*.tsx" -Pattern "mobile"

# Find files
Get-ChildItem -Recurse -Filter "*.tsx"
```

### Git Operations
```powershell
# Status
git status

# Add all changes
git add .

# Commit
git commit -m "Your message"

# Push
git push origin main

# Pull
git pull origin main
```

### Environment Variables
```powershell
# Set temporarily
$env:NODE_ENV = "production"

# View
$env:NODE_ENV

# Set permanently (user level)
[System.Environment]::SetEnvironmentVariable("NODE_ENV", "production", "User")
```

## 🐳 Docker (PowerShell)

```powershell
# Build
docker build -t jobbuddy-backend ./backend
docker build -t jobbuddy-frontend ./frontend

# Run
docker run -p 8080:8080 jobbuddy-backend

# Docker Compose
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml down
```

## 📊 Useful Aliases (Add to PowerShell Profile)

```powershell
# Edit profile
notepad $PROFILE

# Add these aliases:
function jb-dev { cd C:\path\to\jobbuddy; npm run dev }
function jb-test { cd C:\path\to\jobbuddy; npm test }
function jb-build { cd C:\path\to\jobbuddy; npm run build }
function jb-mobile { .\scripts\apply-mobile-fixes.ps1 }
```

## 🔍 Troubleshooting (PowerShell)

### Script Execution Policy
```powershell
# Check current policy
Get-ExecutionPolicy

# Allow scripts (run as Administrator)
Set-ExecutionPolicy RemoteSigned

# Or run specific script
PowerShell -ExecutionPolicy Bypass -File .\script.ps1
```

### Port Already in Use
```powershell
# Find process using port 3000
Get-NetTCPConnection -LocalPort 3000 | Select-Object -Property OwningProcess

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

## 📝 Notes for PowerShell Users

1. **Use backslashes** for paths: `.\scripts\file.ps1`
2. **No chmod needed** - PowerShell scripts run directly
3. **Execution policy** - May need to allow scripts
4. **Color output** - Use `-ForegroundColor` for colored text
5. **Environment variables** - Use `$env:VARIABLE_NAME`

## 🎯 Quick Reference

| Task | PowerShell Command |
|------|-------------------|
| Apply mobile fixes | `.\scripts\apply-mobile-fixes.ps1` |
| Start dev server | `cd frontend; npm start` |
| Run tests | `npm test` |
| Build production | `npm run build` |
| Deploy to GCP | `git push origin main` |
| View logs | `Get-Content -Tail 50 -Wait logfile.log` |

---

**Last Updated:** October 31, 2025  
**For:** PowerShell users on Windows
