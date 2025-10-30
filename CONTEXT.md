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

### 🔴 Current Issues
- **Documentation Chaos:** 56+ MD files cluttering root directory
- **Branch Overload:** 18 branches, many stale/merged
- **GCP Deployment:** Multiple conflicting deployment docs, unclear status
- **Lost Direction:** Too many "next steps" files, no clear path

### 🎯 Active Work
- **NOW:** Repository cleanup and reorganization
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

# Cleanup (NEW)
chmod +x scripts/cleanup-repo.sh
./scripts/cleanup-repo.sh
```

---

## 📝 Key Documentation Files

**Essential (Keep in root):**
- `README.md` - Main project documentation
- `CONTEXT.md` - This file (AI context)
- `PROJECT-STATUS.md` - Current status and recovery plan
- `LICENSE` - MIT license

**Archived (Moving to docs/archive/):**
- All status reports, fix summaries, deployment attempts
- Phase work documentation
- Old "next steps" files

---

## 🎯 Current Priority: Repository Cleanup

**Goal:** Reduce root directory from 56+ files to <10 essential files

**Actions:**
1. ✅ Created cleanup script (`scripts/cleanup-repo.sh`)
2. ⏳ Create CONTEXT.md (this file)
3. ⏳ Archive old documentation
4. ⏳ Delete stale branches
5. ⏳ Create simple DEVELOPMENT.md guide
6. ⏳ Create simple DEPLOYMENT.md guide

---

## 🚨 Important Constraints

**GitHub File Updates:**
- ⚠️ Cannot update large files in single batch
- ✅ Make small, incremental changes
- ✅ Update sections one at a time
- ✅ Use multiple commits for large changes

**Branch Management:**
- Keep: `main`, active feature branches only
- Delete: All `phase-6.1-step-*` branches (work merged)
- Delete: Stale feature branches

---

## 🔗 Important Links

- **Repository:** https://github.com/dannythehat/jobbuddy
- **This File:** https://github.com/dannythehat/jobbuddy/blob/main/CONTEXT.md
- **Status:** https://github.com/dannythehat/jobbuddy/blob/main/PROJECT-STATUS.md
- **Issues:** https://github.com/dannythehat/jobbuddy/issues

---

## 👤 Owner

**Danny Allan** (dannythehat)  
Email: danny@ai-on-auto.com

---

## 📅 Last Updated

**Date:** October 30, 2025  
**Status:** 🔴 Cleanup in progress  
**Next Action:** Run cleanup script and archive old docs

---

**🤖 AI Instructions:**
When helping with this project:
1. Read this file first for context
2. Check PROJECT-STATUS.md for current priorities
3. Make small, incremental file updates only
4. Document all changes clearly
5. Focus on one task at a time
