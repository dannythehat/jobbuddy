# 🎯 START HERE - GCP Deployment

## What We've Set Up

✅ **GitHub Actions Workflow** - Automated deployment pipeline  
✅ **Project Configuration** - `algebraic-link-476405-e9` in `europe-west1`  
✅ **Docker Setup** - Multi-stage builds for backend & frontend  
✅ **Scripts Ready** - All deployment scripts in place  

## 🚀 Quick Start (3 Commands)

```bash
# 1. Fix permissions
chmod +x scripts/fix-gcp-permissions.sh
./scripts/fix-gcp-permissions.sh

# 2. Add GitHub secret (follow script output)

# 3. Deploy
git push origin main
```

## What Happens Next

1. **GitHub Actions triggers** on push to main
2. **Lints & tests** backend and frontend
3. **Builds Docker images** for both services
4. **Pushes to GCR** (Google Container Registry)
5. **Deploys to Cloud Run** in europe-west1
6. **Verifies health** endpoints

## Your Services Will Be At

- **Backend**: `https://jobbuddy-backend-[hash]-ew.a.run.app`
- **Frontend**: `https://jobbuddy-frontend-[hash]-ew.a.run.app`

## If You Need Manual Deployment

```bash
# Build images
docker build -t gcr.io/algebraic-link-476405-e9/jobbuddy-backend:latest ./backend
docker build -t gcr.io/algebraic-link-476405-e9/jobbuddy-frontend:latest ./frontend

# Push to GCR
gcloud auth configure-docker gcr.io
docker push gcr.io/algebraic-link-476405-e9/jobbuddy-backend:latest
docker push gcr.io/algebraic-link-476405-e9/jobbuddy-frontend:latest
```

Then I can deploy via Bhindi once permissions are fixed!

## Files Created

- `.github/workflows/gcp-deploy.yml` - Main deployment workflow
- `scripts/fix-gcp-permissions.sh` - Permission setup
- `GCP-SETUP-NOW.md` - Detailed instructions

## Need Help?

Share output of:
```bash
gcloud config get-value project
gcloud auth list
gcloud run services list --region=europe-west1
```
