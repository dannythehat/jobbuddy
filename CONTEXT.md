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

### ✅ Cleanup Completed
- **Branches:** Reduced from 18 to 5 (deleted 13 stale branches)
- **Documentation:** Created essential guides (DEVELOPMENT.md, DEPLOYMENT.md)
- **Cleanup Script:** Ready to archive old docs (`scripts/cleanup-repo.sh`)

### 🎯 Active Work
- **NOW:** Run cleanup script to archive 50+ old docs
- **NEXT:** Finish Phase 6.1 Stage 2 (Frontend UI for NL search)
- **LATER:** Finalize deployment strategy (GCP vs simpler alternatives)

---

## 🏗️ Project Structure

```
jobbuddy/
├── frontend/          # React TypeScript app
├── backend/           # Node.js Express API
├── docs/              # Documentation (being reorganized)
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
**Deployment Target:** GCP Cloud Run (in progress)

---

## 📋 Development Phases

- ✅ **Phase 1-3:** Core features (CV parsing, job matching, applications)
- ✅ **Phase 4:** Analytics and testing
- ✅ **Phase 5:** Production hardening (security, performance, Docker)
- 🔄 **Phase 6.1:** Natural language search
  - ✅ Stage 1: Backend API (complete)
  - ⏳ Stage 2: Frontend UI (next)
- 📅 **Phase 6.2-6.3:** Global job board integration (planned)

---

## 🔧 Quick Start Commands

```bash
# Development
cd backend && npm run dev
cd frontend && npm start

# Database
node scripts/init-db.js

# Cleanup (Run this next!)
chmod +x scripts/cleanup-repo.sh
./scripts/cleanup-repo.sh
```

---

## 📝 Essential Documentation

**In Root Directory:**
- `README.md` - Main project documentation
- `CONTEXT.md` - This file (AI context)
- `PROJECT-STATUS.md` - Current status and recovery plan
- `DEVELOPMENT.md` - Development guide
- `DEPLOYMENT.md` - Deployment guide
- `LICENSE` - MIT license

**To Be Archived:**
- 50+ status reports, fix summaries, deployment attempts
- Old "next steps" files
- Phase work documentation

---

## 🎯 Current Priority: Final Cleanup Steps

**Remaining Actions:**
1. ✅ Delete stale branches (DONE - 13 deleted)
2. ✅ Create DEVELOPMENT.md (DONE)
3. ✅ Create DEPLOYMENT.md (DONE)
4. ⏳ Run cleanup script locally to archive docs
5. ⏳ Update README.md to reference new structure
6. ⏳ Close cleanup issue (#19)

---

## 🚨 Important Constraints

**GitHub File Updates:**
- ⚠️ Cannot update large files in single batch
- ✅ Make small, incremental changes
- ✅ Update sections one at a time
- ✅ Use multiple commits for large changes

**Branch Management:**
- ✅ Kept: `main` + 4 feature branches
- ✅ Deleted: 13 stale/merged branches

---

## 🔗 Important Links

- **Repository:** https://github.com/dannythehat/jobbuddy
- **This File:** https://github.com/dannythehat/jobbuddy/blob/main/CONTEXT.md
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
**Status:** 🟢 Cleanup 75% complete  
**Next Action:** Run cleanup script locally to archive old docs

---

**🤖 AI Instructions:**
When helping with this project:
1. Read this file first for context
2. Check PROJECT-STATUS.md for current priorities
3. Make small, incremental file updates only
4. Document all changes clearly
5. Focus on one task at a time
