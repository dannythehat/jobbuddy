# 🛠️ Development Guide

Quick guide to developing JobBuddy locally.

---

## 📋 Prerequisites

- **Node.js** 18+
- **PostgreSQL** (local or cloud)
- **Redis** (optional, for caching)
- **OpenAI API Key**

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/dannythehat/jobbuddy.git
cd jobbuddy

# Install dependencies
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment
```bash
# Backend configuration
cd backend
cp .env.example .env

# Edit .env with your credentials:
# - DATABASE_URL
# - OPENAI_API_KEY
# - REDIS_URL (optional)
```

### 3. Initialize Database
```bash
node scripts/init-db.js
```

### 4. Start Development Servers
```bash
# Terminal 1 - Backend (port 5000)
cd backend
npm run dev

# Terminal 2 - Frontend (port 3000)
cd frontend
npm start
```

### 5. Access Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

---

## 📁 Project Structure

```
jobbuddy/
├── frontend/          # React TypeScript app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
│
├── backend/           # Node.js Express API
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── services/
│   └── package.json
│
├── scripts/           # Utility scripts
├── migrations/        # Database migrations
└── docs/              # Documentation
```

---

## 🔧 Common Tasks

### Run Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Database Migrations
```bash
# Create migration
npm run migrate:create migration-name

# Run migrations
npm run migrate:up

# Rollback
npm run migrate:down
```

### Linting & Formatting
```bash
# Backend
cd backend && npm run lint

# Frontend
cd frontend && npm run lint
```

---

## 🐛 Troubleshooting

### Database Connection Issues
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure database exists

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### OpenAI API Errors
- Verify API key is valid
- Check API quota/billing
- Review rate limits

---

## 📚 Additional Resources

- **API Documentation:** See `docs/api.md`
- **Architecture:** See `docs/architecture.md`
- **Contributing:** See `docs/contributing.md`
- **Project Status:** See `PROJECT-STATUS.md`
- **AI Context:** See `CONTEXT.md`

---

## 🤝 Contributing

1. Create feature branch from `main`
2. Make changes with clear commits
3. Test thoroughly
4. Submit PR with description

---

**Need help?** Check `CONTEXT.md` or open an issue.
