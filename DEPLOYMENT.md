# 🚀 Deployment Guide

Simple guide to deploying JobBuddy to production.

---

## ⚡ Quick Deploy Options

### Option 1: Docker Compose (Recommended)
**Best for:** Quick production deployment

```bash
# 1. Configure environment
cp .env.production.example .env.production
# Edit .env.production with production credentials

# 2. Deploy
docker-compose -f docker-compose.prod.yml up -d

# 3. Access
# Frontend: http://your-domain:3000
# Backend: http://your-domain:5000
```

### Option 2: Cloud Platforms (Easiest)
**Best for:** Managed hosting, no DevOps

**Render.com / Railway.app / Fly.io:**
1. Connect GitHub repo
2. Set environment variables
3. Deploy with one click
4. Automatic HTTPS & scaling

### Option 3: GCP Cloud Run (Advanced)
**Best for:** Google Cloud infrastructure

**Status:** Configuration in progress  
**Docs:** See `docs/archive/deployment-attempts/` for GCP setup

---

## 🔧 Environment Variables

### Required
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/jobbuddy

# OpenAI
OPENAI_API_KEY=sk-...

# App
NODE_ENV=production
PORT=5000
```

### Optional
```bash
# Redis (for caching)
REDIS_URL=redis://host:6379

# Security
JWT_SECRET=your-secret-key
SESSION_SECRET=your-session-secret
```

---

## 📋 Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database created and accessible
- [ ] OpenAI API key valid
- [ ] Build passes locally (`npm run build`)
- [ ] Tests pass (`npm test`)
- [ ] Database migrations ready

---

## 🐳 Docker Deployment

### Build Images
```bash
# Build backend
docker build -t jobbuddy-backend -f Dockerfile .

# Build frontend
cd frontend
docker build -t jobbuddy-frontend .
```

### Run Containers
```bash
# Using docker-compose
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

---

## ☁️ Cloud Platform Deployment

### Render.com
1. Create new Web Service
2. Connect GitHub: `dannythehat/jobbuddy`
3. Configure:
   - **Build:** `cd backend && npm install`
   - **Start:** `cd backend && npm start`
4. Add environment variables
5. Deploy

### Railway.app
1. New Project → Deploy from GitHub
2. Select `dannythehat/jobbuddy`
3. Add PostgreSQL database
4. Set environment variables
5. Deploy automatically

### Fly.io
```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Deploy
fly launch
fly deploy
```

---

## 🔒 Security Checklist

- [ ] Use strong database passwords
- [ ] Enable HTTPS/SSL
- [ ] Set secure JWT_SECRET
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Use environment variables (never commit secrets)

---

## 📊 Post-Deployment

### Health Check
```bash
# Backend health
curl https://your-domain/health

# Database connection
curl https://your-domain/api/health/db
```

### Monitoring
- Check application logs
- Monitor database connections
- Track API response times
- Set up error alerts

---

## 🐛 Troubleshooting

### Database Connection Failed
- Verify DATABASE_URL format
- Check database is accessible from deployment
- Ensure SSL mode if required

### Build Failures
- Check Node.js version (18+)
- Verify all dependencies installed
- Review build logs

### Application Crashes
- Check environment variables
- Review application logs
- Verify database migrations ran

---

## 📚 Additional Resources

- **Development:** See `DEVELOPMENT.md`
- **Project Status:** See `PROJECT-STATUS.md`
- **AI Context:** See `CONTEXT.md`
- **GCP Attempts:** See `docs/archive/deployment-attempts/`

---

**Current Status:** Docker Compose ready, GCP in progress  
**Recommended:** Start with Render/Railway for simplicity
