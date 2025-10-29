# 🚀 Next Steps: Deploy to GCP

**Quick Reference** | [Full Roadmap](GCP-MASTER-ROADMAP.md)

---

## ⚡ 5-Minute Deploy

```bash
# 1. Enable APIs (one-time)
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  sqladmin.googleapis.com \
  secretmanager.googleapis.com \
  containerregistry.googleapis.com

# 2. Deploy everything
chmod +x deploy-gcp.sh
./deploy-gcp.sh

# 3. Get your URLs
gcloud run services list --region=europe-west1
```

---

## 📋 Pre-Flight Checklist

- [ ] GCP project: `jobbuddi` ✅
- [ ] Region: `europe-west1` ✅
- [ ] Billing enabled
- [ ] APIs enabled (run command above)
- [ ] OpenAI API key ready

---

## 🎯 What Happens

1. **Creates Cloud SQL database** (if needed)
2. **Generates secrets** (JWT, DB password, encryption key)
3. **Builds Docker images** (backend + frontend)
4. **Deploys to Cloud Run** (auto-scaling, HTTPS)
5. **Runs migrations** (database setup)

---

## 🔗 After Deployment

```bash
# Get backend URL
BACKEND=$(gcloud run services describe jobbuddy-backend \
  --region=europe-west1 --format='value(status.url)')

# Get frontend URL  
FRONTEND=$(gcloud run services describe jobbuddy-frontend \
  --region=europe-west1 --format='value(status.url)')

# Test
curl $BACKEND/health
curl $FRONTEND/health

echo "Backend: $BACKEND"
echo "Frontend: $FRONTEND"
```

---

## 🐛 If Something Fails

```bash
# Check build logs
gcloud builds list --limit=5

# Check service logs
gcloud run services logs read jobbuddy-backend \
  --region=europe-west1 --limit=50

# Check database
gcloud sql instances describe jobbuddy-db
```

---

## 💰 Cost

~€20-40/month, scales to €0 when idle

---

## 📚 Full Documentation

- **Master Roadmap**: [GCP-MASTER-ROADMAP.md](GCP-MASTER-ROADMAP.md)
- **Deployment Guide**: [GCP-DEPLOYMENT.md](GCP-DEPLOYMENT.md)
- **Quick Start**: [DEPLOY.md](DEPLOY.md)

---

**Ready?** Run: `./deploy-gcp.sh` 🚀
