# Backend Application

This directory contains the Node.js/Express backend application for JobBuddy.

## Structure

```
backend/
├── src/                 # Source code
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── tests/               # Test files
├── .env.example         # Environment variables example
├── .eslintrc.js         # ESLint configuration
├── package.json         # Dependencies and scripts
└── README.md            # Backend documentation
```

## Getting Started

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Run tests
npm test

# Start production server
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user account

### CVs
- `POST /api/cvs` - Upload a new CV
- `GET /api/cvs` - Get all user CVs
- `GET /api/cvs/:id` - Get specific CV
- `PUT /api/cvs/:id` - Update CV
- `DELETE /api/cvs/:id` - Delete CV

### Job Preferences
- `POST /api/preferences` - Create job preferences
- `GET /api/preferences` - Get user preferences
- `PUT /api/preferences` - Update preferences

### Jobs
- `GET /api/jobs` - Get matching jobs
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs/:id/apply` - Apply to job

### Applications
- `GET /api/applications` - Get all applications
- `GET /api/applications/:id` - Get application details
- `PUT /api/applications/:id` - Update application status