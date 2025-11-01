<div align="center">

![JobBuddi Logo](https://client-uploads.nyc3.digitaloceanspaces.com/images/731d7eb6-98fd-4f14-8af6-386d93ba0e57/2025-10-24T03-50-17-074Z-0b544258.jpg)

# JobBuddi
*Your AI-Powered Career Assistant* 🤖

[![Production Ready](https://img.shields.io/badge/Status-PRODUCTION%20READY-brightgreen)](PROJECT-STATUS.md)
[![Phase 6.1](https://img.shields.io/badge/Phase-6.1%20IN%20PROGRESS-orange)](PROJECT-STATUS.md)
[![All Bugs Fixed](https://img.shields.io/badge/Bugs-0%20Open-brightgreen)](PROJECT-STATUS.md)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](backend/package.json)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](docker-compose.dev.yml)

</div>

## 🚀 What is JobBuddi?

An intelligent job application automation platform that streamlines your entire job search process with AI-powered assistance. **Now production-ready with enterprise-grade infrastructure!**

**Key Features:**
- 🤖 **AI CV Parsing** - Automatic skill extraction
- 🎯 **Smart Job Matching** - Personalized recommendations  
- 📝 **Auto Application Generation** - AI cover letters & resumes
- 📧 **Response Monitoring** - Email classification & tracking
- 📅 **Interview Automation** - Calendar integration & scheduling
- 📊 **Advanced Analytics** - Comprehensive insights & visualizations
- 🔍 **Natural Language Search** - Search jobs with plain English *(Phase 6.1 - Backend Complete ✅)*
- 🔒 **Enterprise Security** - Rate limiting, validation, monitoring
- ⚡ **High Performance** - Redis caching, optimization, scaling

## ⚡ Quick Start (Docker - Recommended)

**No scripts needed! Just 3 commands:**

```bash
# 1. Clone and enter directory
git clone https://github.com/dannythehat/jobbuddy.git
cd jobbuddy

# 2. Add your OpenAI API key
echo "OPENAI_API_KEY=sk-your-key-here" > .env

# 3. Start everything
docker-compose -f docker-compose.dev.yml up
```

**That's it!** 🎉
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

📖 **[Full Quick Start Guide](QUICKSTART.md)** | 🔧 **[Troubleshooting](TROUBLESHOOTING.md)**

## 🛠️ Manual Setup (Without Docker)

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis (optional)
- OpenAI API key

### Setup Steps
```bash
# Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials

# Start backend
cd backend
npm install
npm run dev

# Start frontend (new terminal)
cd frontend
npm install
npm start
```

## 🎯 Current Status

🎉 **PRODUCTION READY - Phase 5 COMPLETED!**
- Enterprise-grade security with comprehensive hardening
- High-performance caching and optimization systems
- Docker containerization with full orchestration
- Production monitoring with health checks and metrics

🔄 **Phase 6.1 IN PROGRESS - Natural Language Job Search**
- ✅ **Stage 1: Backend Integration COMPLETE**
  - Backend API endpoints tested and documented
- ⏳ **Stage 2: Frontend UI** (Next)
  - Add NL search input to JobsPage
  - Create search suggestions component
  - Display parsed query feedback

**Latest Achievement:** Natural language backend fully operational with AI-powered query parsing! 🎉

## 🛠️ Tech Stack

**Frontend:** React, TypeScript, Material UI, Recharts  
**Backend:** Node.js, Express, PostgreSQL, Redis  
**AI:** OpenAI API, Intelligent parsing & generation  
**Infrastructure:** Docker, Nginx, Prometheus, Grafana
**Security:** Helmet, Rate Limiting, Input Validation
**Performance:** Redis Caching, Compression, Monitoring

## 🔒 Production Features

- **Security Hardening** - Rate limiting, XSS protection, input validation
- **Performance Optimization** - Redis caching, query optimization, compression
- **Monitoring** - Health checks, metrics, logging
- **Scalability** - Docker orchestration, load balancing ready
- **CI/CD** - Automated testing and deployment pipelines

## 📚 Documentation

- 📖 **[Quick Start Guide](QUICKSTART.md)** - Get running in 3 commands
- 🔧 **[Troubleshooting Guide](TROUBLESHOOTING.md)** - Common issues & solutions
- 🚀 **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment
- 🏗️ **[Architecture](docs/architecture.md)** - System design
- 🔌 **[API Documentation](docs/api.md)** - API reference
- ✨ **[Features](docs/features.md)** - Feature overview
- 🤝 **[Contributing](docs/contributing.md)** - Contribution guidelines

## 🆘 Need Help?

1. Check **[QUICKSTART.md](QUICKSTART.md)** for setup instructions
2. Check **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** for common issues
3. Open an issue on GitHub with your error details

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

Built with ❤️ using modern web technologies and AI assistance.

---

<div align="center">

**[⭐ Star this repo](https://github.com/dannythehat/jobbuddy)** if you find it helpful!

</div>
