# Phase 6.2: GCP Cloud Deployment

## 🎯 Current Status: READY TO DEPLOY

### Overview
Deploy JobBuddy to Google Cloud Platform with Cloud Run, Cloud SQL, and Cloud Storage.

**Project:** algebraic-link-476405-e9  
**Region:** europe-west1 (Belgium)

## ✅ Prerequisites (All Complete)

### Infrastructure Ready
- ✅ Docker containers configured (backend + frontend)
- ✅ Cloud Build pipeline (`cloudbuild.yaml`)
- ✅ GitHub Actions workflow (`.github/workflows/gcp-deploy.yml`)
- ✅ Deployment scripts in `/scripts`
- ✅ Health check endpoints
- ✅ Database migrations ready

### Code Quality
- ✅ Backend tests passing
- ✅ Frontend tests passing
- ✅ Linting configured
- ✅ TypeScript compilation working
- ✅ Production builds successful

## 🚀 Deployment Steps

### Step 1: Configure GCP Permissions
```bash
chmod +x scripts/fix-gcp-permissions.sh
./scripts/fix-gcp-permissions.sh
```

**What this does:**
- Creates GitHub Actions service account
- Grants Cloud Run admin permissions
- Grants Storage admin permissions
- Generates service account key

### Step 2: Create GCP Secrets
```bash
chmod +x scripts/create-secrets.sh
./scripts/create-secrets.sh
```

**Required secrets:**
- `jobbuddy-db-password` - PostgreSQL database password
- `jobbuddy-jwt-secret` - JWT token signing secret
- `jobbuddy-openai-key` - OpenAI API key for AI features
- `jobbuddy-encryption-key` - Data encryption key

### Step 3: Add GitHub Secret
1. Go to: https://github.com/dannythehat/jobbuddy/settings/secrets/actions
2. Click "New repository secret"
3. Name: `GCP_SA_KEY`
4. Value: Contents of `github-actions-key.json` from Step 1

### Step 4: Deploy to GCP
```bash
git push origin main
```

**Automated deployment will:**
1. Run backend linting and tests
2. Run frontend linting and tests
3. Build Docker images
4. Push to Google Container Registry
5. Deploy backend to Cloud Run
6. Deploy frontend to Cloud Run
7. Run database migrations
8. Verify health endpoints

## 📊 Expected Infrastructure

### Cloud Run Services
- **Backend:** `jobbuddy-backend`
  - URL: `https://jobbuddy-backend-*.a.run.app`
  - Memory: 1Gi
  - CPU: 1
  - Min instances: 0
  - Max instances: 10
  - Port: 8080

- **Frontend:** `jobbuddy-frontend`
  - URL: `https://jobbuddy-frontend-*.a.run.app`
  - Memory: 512Mi
  - CPU: 1
  - Min instances: 0
  - Max instances: 5
  - Port: 8080

### Cloud SQL
- **Instance:** `jobbuddy-db`
- **Type:** PostgreSQL 14
- **Region:** europe-west1
- **Tier:** db-f1-micro (can scale up)

### Cloud Storage
- **Bucket:** `jobbuddy-uploads-{project-id}`
- **Location:** europe-west1
- **Storage class:** Standard
- **Purpose:** CV uploads, generated documents

### Container Registry
- **Images:**
  - `gcr.io/algebraic-link-476405-e9/jobbuddy-backend`
  - `gcr.io/algebraic-link-476405-e9/jobbuddy-frontend`

## ✅ Validation

### Automated Checks
```bash
chmod +x scripts/validate-deployment.sh
./scripts/validate-deployment.sh
```

**Validates:**
- Backend health endpoint responding
- Frontend health endpoint responding
- Database connectivity
- API endpoints functional
- Authentication working

### Manual Verification
1. Visit frontend URL
2. Register/login
3. Upload CV
4. Create job preferences
5. Browse jobs
6. Generate application
7. Check analytics dashboard

## 🔧 Post-Deployment Configuration

### Domain Setup (Optional)
1. Configure custom domain in Cloud Run
2. Update DNS records
3. Enable SSL certificate

### Monitoring
- Cloud Monitoring dashboards
- Log aggregation in Cloud Logging
- Error reporting
- Uptime checks

### Scaling
- Adjust min/max instances based on traffic
- Configure autoscaling triggers
- Monitor costs in Cloud Billing

## 📈 Success Metrics

### Performance Targets
- ⚡ API response time < 500ms
- ⚡ Page load time < 2s
- ⚡ Application generation < 3s
- 🔒 99.9% uptime
- 📊 Real-time analytics

### Cost Estimates
- **Cloud Run:** ~$5-20/month (low traffic)
- **Cloud SQL:** ~$10-30/month (db-f1-micro)
- **Cloud Storage:** ~$1-5/month
- **Total:** ~$16-55/month for initial deployment

## 🎯 Next Steps After Deployment

1. **Phase 6.1 Completion** - Fix natural language search handler (#24)
2. **Phase 6.3** - Advanced AI search features
3. **Phase 7** - Job board integrations
4. **Phase 8** - Enterprise features

## 📚 Related Documentation

- [GCP Setup Guide](../GCP-SETUP-NOW.md)
- [Deployment Checklist](../GCP-DEPLOYMENT-CHECKLIST.md)
- [Cloud Build Config](../cloudbuild.yaml)
- [GitHub Actions Workflow](../.github/workflows/gcp-deploy.yml)

## 🔗 Related Issues

- #17 - Finalize GCP Deployment Configuration
- #18 - GCP Deployment Automation
- #27 - Execute GCP Deployment (THIS PHASE)

---

**Status:** 🟢 READY TO EXECUTE  
**Last Updated:** October 31, 2025
