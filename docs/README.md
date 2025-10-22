# Documentation

This directory contains comprehensive documentation for the JobBuddy application.

## Contents

### User Documentation
- `user-guide.md` - Complete guide for end users
- `faq.md` - Frequently asked questions
- `troubleshooting.md` - Common issues and solutions

### Developer Documentation
- `architecture.md` - System architecture overview
- `api-reference.md` - API documentation
- `database-schema.md` - Database structure and relationships
- `frontend-guide.md` - Frontend development guide
- `backend-guide.md` - Backend development guide
- `n8n-integration.md` - n8n workflow documentation

### Deployment Documentation
- `installation.md` - Installation instructions
- `configuration.md` - Configuration options
- `deployment.md` - Deployment guides for different environments
- `security.md` - Security best practices

### Contributing Documentation
- `contributing.md` - Guidelines for contributors
- `code-of-conduct.md` - Community code of conduct
- `style-guide.md` - Coding style guidelines
- `testing.md` - Testing procedures

## Maintenance

Documentation should be updated with each new feature or significant change to the system. All documentation is written in Markdown format for easy maintenance and version control.

## Generating API Documentation

API documentation is automatically generated from code comments using JSDoc. To update the API documentation:

```bash
# Navigate to the backend directory
cd ../backend

# Generate API documentation
npm run docs
```

## Style Guide

When contributing to documentation:

1. Use clear, concise language
2. Include examples where appropriate
3. Use proper Markdown formatting
4. Keep sections organized and hierarchical
5. Update the table of contents when adding new sections
6. Include screenshots for UI-related documentation