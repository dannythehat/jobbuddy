# System Architecture

## Overview

JobBuddi follows a modern full-stack architecture with clear separation of concerns.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   React/TS      │◄──►│  Node.js/Express│◄──►│  PostgreSQL     │
│   Material UI   │    │   TypeScript    │    │   Sequelize     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │   External APIs │              │
         └──────────────►│   OpenAI API    │◄─────────────┘
                        │ Google Calendar │
                        │   File Storage  │
                        └─────────────────┘
```

## Frontend Architecture

**Technology:** React 18, TypeScript, Material UI

**Structure:**
- `src/components/` - Reusable UI components
- `src/pages/` - Page-level components
- `src/contexts/` - React contexts (Auth, etc.)
- `src/services/` - API communication
- `src/utils/` - Helper functions

## Backend Architecture

**Technology:** Node.js, Express, TypeScript

**Structure:**
- `src/controllers/` - Request handlers
- `src/services/` - Business logic
- `src/models/` - Database models
- `src/routes/` - API routes
- `src/middleware/` - Express middleware
- `src/config/` - Configuration

## Database Schema

**Technology:** PostgreSQL with Sequelize ORM

**Core Models:**
- User, CV, JobPreference
- Job, Application, Certificate
- Response, Interview

## External Integrations

- **OpenAI API** - CV parsing, content generation
- **Google Calendar** - Interview scheduling
- **File Storage** - CV and certificate uploads
- **n8n** - Workflow automation

## Security

- JWT authentication
- OAuth for external services
- File upload validation
- SQL injection prevention
- XSS protection