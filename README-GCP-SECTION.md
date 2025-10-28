# GCP Deployment Section for README.md

Add this section to the README.md after the "Production Deployment" section:

---

## ☁️ GCP Deployment

Deploy JobBuddy to Google Cloud Platform with Cloud Run, Cloud SQL, and automated CI/CD.

### Quick Deploy to GCP

```bash
# 1. Setup GCP project and resources
chmod +x scripts/setup-gcp.sh
./scripts/setup-gcp.sh

# 2. Create secrets in Secret Manager
chmod +x scripts/create-secrets.sh
./scripts/create-secrets.sh

# 3. Connect GitHub repository to Cloud Build
# (Follow instructions in GCP-DEPLOYMENT.md)

# 4. Push to main branch to trigger deployment
git push origin main
```

### Architecture

- **Backend**: Cloud Run (Node.js/Express) - Auto-scaling, port 8080
- **Frontend**: Cloud Run (React/Nginx) - CDN-ready, port 8080
- **Database**: Cloud SQL (PostgreSQL) - Managed, automated backups
- **Secrets**: Secret Manager - Secure credential storage
- **CI/CD**: Cloud Build + GitHub Actions - Automated testing & deployment
- **Registry**: Google Container Registry - Docker image storage

### Deployment Flow

1. **Push to GitHub** → Triggers GitHub Actions CI (lint + test)
2. **CI Passes** → Cloud Build trigger activates
3. **Cloud Build** → Builds Docker images, runs tests
4. **Deploy** → Pushes to GCR, deploys to Cloud Run
5. **Migrate** → Runs database migrations automatically
6. **Live** → Services available at Cloud Run URLs

### Monitoring

```bash
# View backend logs
gcloud run services logs read jobbuddy-backend --region=us-central1

# View frontend logs
gcloud run services logs read jobbuddy-frontend --region=us-central1

# Check service status
gcloud run services describe jobbuddy-backend --region=us-central1
```

### Health Checks

- Backend: `https://jobbuddy-backend-REGION.a.run.app/health`
- Frontend: `https://jobbuddy-frontend-REGION.a.run.app/health`

### Cost Estimate

- **Cloud Run**: ~$5-20/month (pay per request, scales to zero)
- **Cloud SQL**: ~$10-50/month (db-f1-micro to db-n1-standard-1)
- **Container Registry**: ~$1-5/month (image storage)
- **Total**: ~$16-75/month for production workload

📖 **[Complete GCP Deployment Guide](GCP-DEPLOYMENT.md)**

---

### Branch Protection & CI/CD

**Automated Deployment Triggers:**
- `main` branch → Production deployment
- `develop` branch → Staging deployment (optional)
- `feature/*` branches → CI only (lint + test)

**GitHub Actions CI:**
- Runs on all pushes and pull requests
- Lints backend and frontend code
- Runs unit and integration tests
- Must pass before Cloud Build triggers

**Cloud Build:**
- Triggers only on `main` branch (configurable)
- Builds Docker images with multi-stage optimization
- Runs tests in isolated containers
- Deploys to Cloud Run on success
- Runs database migrations automatically

### Security Features

✅ Multi-stage Docker builds (minimal attack surface)  
✅ Non-root containers (enhanced security)  
✅ Secret Manager integration (no hardcoded credentials)  
✅ Cloud SQL Proxy (encrypted database connections)  
✅ Health checks (automatic restart on failure)  
✅ Rate limiting (DDoS protection)  
✅ CORS configuration (XSS prevention)  
✅ Security headers (comprehensive protection)

### Troubleshooting

**Build fails:**
```bash
gcloud builds log BUILD_ID
```

**Service not responding:**
```bash
gcloud run services describe jobbuddy-backend --region=us-central1
gcloud run services logs read jobbuddy-backend --region=us-central1 --limit=50
```

**Database connection issues:**
```bash
gcloud sql instances describe jobbuddy-db
gcloud sql connect jobbuddy-db --user=postgres
```

📖 **[Full Troubleshooting Guide](GCP-DEPLOYMENT.md#troubleshooting)**
