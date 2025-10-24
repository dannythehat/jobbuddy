<div align="center">

![JobBuddi Logo](https://client-uploads.nyc3.digitaloceanspaces.com/images/731d7eb6-98fd-4f14-8af6-386d93ba0e57/2025-10-24T03-50-17-074Z-0b544258.jpg)

# JobBuddi
*Your AI-Powered Career Assistant* 🤖

[![Production Ready](https://img.shields.io/badge/Status-PRODUCTION%20READY-brightgreen)](docs/roadmap.md)
[![Phase 5](https://img.shields.io/badge/Phase-5%20Complete-success)](docs/roadmap.md)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](package.json)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](docker-compose.prod.yml)

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
- 🔒 **Enterprise Security** - Rate limiting, validation, monitoring
- ⚡ **High Performance** - Redis caching, optimization, scaling

## ⚡ Quick Start

### Development Setup
```bash
git clone https://github.com/dannythehat/jobbuddy.git
cd jobbuddy
./scripts/setup-dev.sh
```

### Production Deployment
```bash
# Using Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Manual deployment
npm run build
npm run start
```

**Requirements:** Node.js 18+, PostgreSQL, Redis, OpenAI API key

📖 **[Full Setup Guide](docs/setup.md)** | 🏗️ **[Architecture](docs/architecture.md)** | 🛣️ **[Roadmap](docs/roadmap.md)**

## 🎯 Current Status

🎉 **PRODUCTION READY - Phase 5 COMPLETED!**
- Enterprise-grade security with comprehensive hardening
- High-performance caching and optimization systems
- Docker containerization with full orchestration
- Production monitoring with health checks and metrics
- Complete CI/CD pipeline with automated deployment

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
- 🤝 **[Contributing](docs/contributing.md)** - How to contribute

## 🚀 Deployment

JobBuddi is production-ready with multiple deployment options:

- **Docker Compose** - Complete stack with one command
- **Kubernetes** - Scalable container orchestration
- **Traditional** - Direct server deployment
- **Cloud** - AWS, GCP, Azure compatible

See [deployment documentation](docs/deployment.md) for detailed instructions.

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](docs/contributing.md).

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

## 📞 Contact

**Danny Allan** - dannythetruther@gmail.com  
**Project:** [github.com/dannythehat/jobbuddy](https://github.com/dannythehat/jobbuddy)

---

<div align="center">
<em>🎉 Production Ready - Built with ❤️ for job seekers everywhere 🎉</em>
</div>