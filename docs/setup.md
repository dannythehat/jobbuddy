# Setup Guide

## Prerequisites

- Node.js (v18+)
- npm or yarn
- PostgreSQL
- OpenAI API key
- Google Calendar API credentials (optional)

## Environment Variables

Create `.env` in the backend directory:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/jobbuddy
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jobbuddy
DB_USER=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Google Calendar (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# Server
PORT=5000
NODE_ENV=development
```

## Quick Setup

```bash
# Clone repository
git clone https://github.com/dannythehat/jobbuddy.git
cd jobbuddy

# Run setup script
chmod +x scripts/setup-dev.sh
./scripts/setup-dev.sh

# Initialize database
node scripts/init-db.js

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Start development servers
# Terminal 1 (Backend)
cd backend && npm run dev

# Terminal 2 (Frontend)
cd frontend && npm start
```

## Manual Setup

```bash
# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration

# Frontend setup
cd ../frontend
npm install

# Database initialization
cd ..
node scripts/init-db.js
```

## Development

- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:3000`
- Database should be running on port 5432

## Troubleshooting

**Database Connection Issues:**
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists

**OpenAI API Issues:**
- Verify API key is valid
- Check API quota and billing

**Google Calendar Issues:**
- Ensure OAuth credentials are correct
- Check redirect URI matches exactly