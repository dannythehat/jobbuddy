# 🎯 CONTEXT.md - JobBuddy Project Overview

**📍 Share this URL with any AI:** `https://github.com/dannythehat/jobbuddy/blob/main/CONTEXT.md`

---

## 🚀 What is JobBuddy?

An AI-powered job application automation platform built with React, Node.js, PostgreSQL, and OpenAI integration.

**Core Features:**
- AI CV parsing and skill extraction
- Smart job matching and recommendations
- Automated application generation
- Email response monitoring
- Interview scheduling automation
- Natural language job search (Phase 6.1 - Backend complete)

---

## 📊 Current Status (Oct 30, 2025)

### ✅ What Works
- **Core Application:** React frontend + Node.js backend running locally
- **Database:** PostgreSQL with job tracking schema
- **AI Integration:** OpenAI API for CV parsing and NL search
- **Phase 6.1 Backend:** Natural language search API completed

### ✅ Repository Cleanup - COMPLETE! 🎉
- **Root Directory:** Cleaned from 67 files to 13 essential files
- **Branches:** Reduced from 18 to 5 active branches
- **Documentation:** Organized and consolidated
- **Essential Guides:** Created AI-WORKFLOW.md, DEVELOPMENT.md, DEPLOYMENT.md
- **Status:** Repository is now clean, organized, and ready for development

### 🎯 Ready for Development
- **NOW:** Build Phase 6.1 Stage 2 (Frontend UI for NL search)
- **NEXT:** Continue feature development
- **LATER:** Finalize deployment strategy

---

## 🏗️ Project Structure

```
jobbuddy/
├── frontend/          # React TypeScript app
├── backend/           # Node.js Express API
├── docs/              # Documentation
├── scripts/           # Utility scripts
├── migrations/        # Database migrations
├── n8n-workflows/     # Automation workflows
└── terraform/         # Infrastructure as code
```

---

## 🛠️ Tech Stack

**Frontend:** React, TypeScript, Material UI, Recharts  
**Backend:** Node.js, Express, PostgreSQL, Redis  
**AI:** OpenAI API (GPT models)  
**Infrastructure:** Docker, Docker Compose  
**Deployment Target:** GCP Cloud Run (configured, pending deployment)

---

## 📋 Development Phases

- ✅ **Phase 1-3:** Core features (CV parsing, job matching, applications)
- ✅ **Phase 4:** Analytics and testing
- ✅ **Phase 5:** Production hardening (security, performance, Docker)
- 🔄 **Phase 6.1:** Natural language search
  - ✅ Stage 1: Backend API (complete)
  - ⏳ Stage 2: Frontend UI (ready to build)
- 📅 **Phase 6.2-6.3:** Global job board integration (planned)

---

## 🔧 Quick Start Commands

```bash
# Development
cd backend && npm run dev
cd frontend && npm start

# Database
node scripts/init-db.js
```

---

## 📝 Essential Documentation

**Root Directory (13 files total):**
- `README.md` - Main project documentation
- `CONTEXT.md` - This file (AI context)
- `AI-WORKFLOW.md` - **AI standard operating procedures**
- `PROJECT-STATUS.md` - Current status
- `DEVELOPMENT.md` - Development guide
- `DEPLOYMENT.md` - Deployment guide
- `LICENSE` - MIT license

**docs/ Directory:**
- Phase specifications (phase-6.1-spec.md, phase-6.2-spec.md, etc.)
- Feature documentation
- Implementation guides
- API documentation

---

## 🔗 Important Links

- **Repository:** https://github.com/dannythehat/jobbuddy
- **This File:** https://github.com/dannythehat/jobbuddy/blob/main/CONTEXT.md
- **AI Workflow:** https://github.com/dannythehat/jobbuddy/blob/main/AI-WORKFLOW.md
- **Status:** https://github.com/dannythehat/jobbuddy/blob/main/PROJECT-STATUS.md
- **Development:** https://github.com/dannythehat/jobbuddy/blob/main/DEVELOPMENT.md
- **Deployment:** https://github.com/dannythehat/jobbuddy/blob/main/DEPLOYMENT.md
- **Issues:** https://github.com/dannythehat/jobbuddy/issues

---

## 👤 Owner

**Danny Allan** (dannythehat)  
Email: danny@ai-on-auto.com

---

## 📅 Last Updated

**Date:** October 30, 2025  
**Status:** 🟢 Repository clean and ready for development!  
**Next Action:** Build Phase 6.1 Stage 2 (Frontend UI for NL search)

---

**🤖 AI Instructions:**
When helping with this project:
1. **READ AI-WORKFLOW.md FIRST** - Contains standard operating procedures
2. Read this file for project context
3. Check PROJECT-STATUS.md for current priorities
4. Make small, incremental changes only
5. Document all changes clearly
6. Keep repository clean and organized
7. Focus on building features, not creating documentation chaos
