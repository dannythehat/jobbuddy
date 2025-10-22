# Utility Scripts

This directory contains utility scripts for development, deployment, and maintenance of the JobBuddy application.

## Available Scripts

### Development Scripts
- `setup-dev.sh` - Set up development environment
- `generate-mock-data.js` - Generate mock data for testing
- `reset-db.js` - Reset database to initial state
- `seed-db.js` - Seed database with sample data

### Deployment Scripts
- `deploy-frontend.sh` - Deploy frontend to production
- `deploy-backend.sh` - Deploy backend to production
- `setup-ci.sh` - Set up CI/CD pipeline

### Database Scripts
- `backup-db.sh` - Create database backup
- `migrate-db.js` - Run database migrations
- `db-status.js` - Check database status

### Maintenance Scripts
- `check-dependencies.js` - Check for outdated dependencies
- `update-dependencies.sh` - Update project dependencies
- `lint-fix.sh` - Run linter and fix issues
- `prune-logs.sh` - Clean up log files

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