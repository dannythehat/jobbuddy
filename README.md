<div align="center">

![JobBuddy Logo](https://client-uploads.nyc3.digitaloceanspaces.com/images/731d7eb6-98fd-4f14-8af6-386d93ba0e57/2025-10-24T03-50-17-074Z-0b544258.jpg)

# JobBuddy
*Your AI-Powered Career Assistant* 🤖

[![Production Ready](https://img.shields.io/badge/Status-PRODUCTION%20READY-brightgreen)](docs/roadmap.md)
[![Phase 6.1](https://img.shields.io/badge/Phase-6.1%20IN%20PROGRESS-orange)](docs/roadmap.md)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](backend/package.json)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](docker-compose.prod.yml)

</div>

## 🚀 What is JobBuddy?

An intelligent job application automation platform that streamlines your entire job search process with AI-powered assistance. **Now production-ready with enterprise-grade infrastructure!**

**Key Features:**
- 🤖 **AI CV Parsing** - Automatic skill extraction
- 🎯 **Smart Job Matching** - Personalized recommendations  
- 📝 **Auto Application Generation** - AI cover letters & resumes
- 📧 **Response Monitoring** - Email classification & tracking
- 📅 **Interview Automation** - Calendar integration & scheduling
- 📊 **Advanced Analytics** - Comprehensive insights & visualizations
- 🔍 **Natural Language Search** - Search jobs with plain English *(Phase 6.1 - In Development)*
- 🔒 **Enterprise Security** - Rate limiting, validation, monitoring
- ⚡ **High Performance** - Redis caching, optimization, scaling

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis
- OpenAI API key

### Development Setup
```bash
git clone https://github.com/dannythehat/jobbuddy.git
cd jobbuddy

# Make setup script executable and run
chmod +x scripts/setup-dev.sh
./scripts/setup-dev.sh

# Configure environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your database and API credentials

# Initialize database
node scripts/init-db.js

# Start development servers
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm start
```

### Production Deployment
```bash
# Using Docker Compose (Recommended)
docker-compose -f docker-compose.prod.yml up -d

# Manual deployment
npm run build
npm run start
```

📖 **[Full Setup Guide](docs/setup.md)** | 🏗️ **[Architecture](docs/architecture.md)** | 🛣️ **[Roadmap](docs/roadmap.md)** | 🚀 **[Deployment](docs/deployment.md)**

## 🎯 Current Status

🎉 **PRODUCTION READY - Phase 5 COMPLETED!**
- Enterprise-grade security with comprehensive hardening
- High-performance caching and optimization systems
- Docker containerization with full orchestration
- Production monitoring with health checks and metrics
- Complete CI/CD pipeline with automated deployment

🔄 **Phase 6.1 IN PROGRESS - Natural Language Job Search**
- AI-powered natural language query processing
- Intelligent search with plain English commands
- Enhanced user experience with conversational search
- Smart filter translation and result optimization

**Achievement:** Full production launch with enterprise infrastructure! 🚀

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
- **Container Deployment** - Docker, Docker Compose, health checks
- **Monitoring & Alerting** - Prometheus, Grafana, logging systems
- **Scalable Architecture** - Load balancing, caching, database optimization

## 📚 Documentation

- 📖 **[Setup Guide](docs/setup.md)** - Installation & configuration
- 🏗️ **[Architecture](docs/architecture.md)** - System design & structure  
- 🔌 **[API Reference](docs/api.md)** - Complete endpoint documentation
- ✨ **[Features](docs/features.md)** - Detailed feature breakdown
- 🛣️ **[Roadmap](docs/roadmap.md)** - Development phases & progress
- 🚀 **[Deployment](docs/deployment.md)** - Production deployment guide
- 🤝 **[Contributing](docs/contributing.md)** - How to contribute

## 🚀 Deployment Options

JobBuddy is production-ready with multiple deployment options:

- **Docker Compose** - Complete stack with one command
- **Kubernetes** - Scalable container orchestration  
- **Traditional** - Direct server deployment
- **Cloud** - AWS, GCP, Azure compatible

See the [Deployment Guide](docs/deployment.md) for detailed instructions.

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See our [Contributing Guide](docs/contributing.md) for detailed guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 📞 Contact

**Danny Allan** - dannythetruther@gmail.com  
**Project:** [github.com/dannythehat/jobbuddy](https://github.com/dannythehat/jobbuddy)

---

<div align="center">
<em>🎉 Production Ready - Phase 6.1 Natural Language Search in Development 🔍</em>
</div>