# Utility Scripts

This directory contains utility scripts for development, deployment, and maintenance of the JobBuddy application.

## 🚀 Backend Compile Fix Scripts (NEW)

### Quick Start (Recommended)
Run the complete fix workflow with one command:

```bash
chmod +x scripts/quick-start-fix.sh
./scripts/quick-start-fix.sh
```

This script will:
1. ✅ Fix Response type conflicts in all controllers
2. ✅ Install dependencies
3. ✅ Verify TypeScript compilation (0 errors)
4. ✅ Start backend and check for runtime errors
5. ✅ Run basic smoke tests
6. ✅ Generate logs for verification

### Individual Fix Scripts

#### fix-response-types.sh
Fixes the Response type naming conflict between Express and the Response model.

```bash
chmod +x scripts/fix-response-types.sh
./scripts/fix-response-types.sh
```

#### quick-start-fix.sh
Complete automated workflow for the entire backend compile fix process.

```bash
chmod +x scripts/quick-start-fix.sh
./scripts/quick-start-fix.sh
```

**See `PROGRESS.md` for detailed documentation on the backend compile fix.**

---

## Available Scripts

### Development Scripts
- `setup-dev.sh` - Set up development environment
- `verify-setup.sh` - Verify development environment setup
- `init-db.js` - Initialize database

### Deployment Scripts
- `deploy-cloud-run.sh` - Deploy to Google Cloud Run
- `setup-gcp.sh` - Set up Google Cloud Platform
- `fix-gcp-permissions.sh` - Fix GCP permissions
- `validate-deployment.sh` - Validate deployment
- `create-secrets.sh` - Create secrets for deployment
- `fetch-secrets.sh` - Fetch secrets from GCP

### Database Scripts
- `migrate.sh` - Run database migrations
- `init-db.js` - Initialize database

### Maintenance Scripts
- `cleanup-repo.sh` - Clean up repository
- `integrate-nl-search.sh` - Integrate natural language search
- `setup-phase-7.sh` - Set up phase 7 features
- `apply-phase-6.1-stage-2.sh` - Apply phase 6.1 stage 2
- `restore-jobspage.sh` - Restore jobs page
- `fix-jobspage.py` - Fix jobs page (Python)

## Usage

Most scripts can be run directly from the command line:

```bash
# Make script executable
chmod +x scripts/script-name.sh

# Run script
./scripts/script-name.sh
```

For Node.js scripts:

```bash
node scripts/script-name.js
```

For Python scripts:

```bash
python scripts/script-name.py
```

## Adding New Scripts

When adding new scripts:

1. Add appropriate shebang line (e.g., `#!/bin/bash` or `#!/usr/bin/env node`)
2. Make scripts executable (`chmod +x script-name.sh`)
3. Include comments explaining what the script does
4. Update this README with script description
5. Test the script in development environment before committing

## Script Documentation

Each script should include:

- Description of its purpose at the top
- Required parameters or environment variables
- Example usage
- Expected output or side effects
