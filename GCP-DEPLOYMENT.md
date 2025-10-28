# GCP Deployment Guide

Complete guide for deploying JobBuddy to Google Cloud Platform using Cloud Run, Cloud SQL, and Cloud Build.

## Prerequisites

- GCP account with billing enabled
- `gcloud` CLI installed
- GitHub repository connected to GCP
- Domain name (optional, for custom domains)

## Quick Start

```bash
# 1. Run setup script
chmod +x scripts/setup-gcp.sh
./scripts/setup-gcp.sh

# 2. Create secrets
./scripts/create-secrets.sh

# 3. Set up Cloud Build trigger
# (See "Cloud Build Trigger Setup" below)

# 4. Push to main branch
git push origin main
```

## Architecture

- **Backend**: Node.js/Express on Cloud Run (port 8080)
- **Frontend**: React/Nginx on Cloud Run (port 8080)
- **Database**: Cloud SQL (PostgreSQL)
- **Secrets**: Secret Manager
- **CI/CD**: Cloud Build + GitHub Actions
- **Container Registry**: Google Container Registry (GCR)

## Detailed Setup

### 1. Enable Required APIs

```bash
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    sqladmin.googleapis.com \
    secretmanager.googleapis.com \
    containerregistry.googleapis.com
```

### 2. Create Cloud SQL Instance

```bash
gcloud sql instances create jobbuddy-db \
    --database-version=POSTGRES_14 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --root-password=YOUR_SECURE_PASSWORD
```

### 3. Create Database

```bash
gcloud sql databases create jobbuddy_prod \
    --instance=jobbuddy-db
```

### 4. Create Secrets in Secret Manager

```bash
# Database password
echo -n "your_db_password" | gcloud secrets create jobbuddy-db-password --data-file=-

# JWT secret
echo -n "your_jwt_secret_32_chars_min" | gcloud secrets create jobbuddy-jwt-secret --data-file=-

# OpenAI API key
echo -n "sk-your-openai-key" | gcloud secrets create jobbuddy-openai-key --data-file=-

# Encryption key
echo -n "your_encryption_key" | gcloud secrets create jobbuddy-encryption-key --data-file=-
```

### 5. Grant Secret Access to Cloud Build

```bash
PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format="value(projectNumber)")

gcloud secrets add-iam-policy-binding jobbuddy-db-password \
    --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

# Repeat for all secrets
```

## Cloud Build Trigger Setup

### Option 1: Using gcloud CLI

```bash
gcloud builds triggers create github \
    --repo-name=jobbuddy \
    --repo-owner=YOUR_GITHUB_USERNAME \
    --branch-pattern="^main$" \
    --build-config=cloudbuild.yaml \
    --substitutions=_REGION=us-central1,_CLOUDSQL_INSTANCE=PROJECT_ID:us-central1:jobbuddy-db
```

### Option 2: Using GCP Console

1. Go to Cloud Build > Triggers
2. Click "Create Trigger"
3. Connect your GitHub repository
4. Configure:
   - **Name**: jobbuddy-deploy
   - **Event**: Push to branch
   - **Branch**: ^main$
   - **Configuration**: Cloud Build configuration file
   - **Location**: /cloudbuild.yaml
5. Add substitution variables:
   - `_REGION`: us-central1
   - `_CLOUDSQL_INSTANCE`: PROJECT_ID:REGION:jobbuddy-db

## Environment Variables

### Backend (.env.production)

```bash
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://user:password@/cloudsql/PROJECT:REGION:INSTANCE/dbname
DB_HOST=/cloudsql/PROJECT:REGION:INSTANCE
DB_PORT=5432
DB_NAME=jobbuddy_prod
```

### Frontend

```bash
REACT_APP_API_URL=https://jobbuddy-backend-REGION.a.run.app
REACT_APP_ENV=production
```

## Deployment Flow

1. **Developer pushes to GitHub** (main, develop, or feature branch)
2. **GitHub Actions runs CI** (lint + test)
3. **If CI passes and branch is main**:
   - Cloud Build trigger activates
   - Builds Docker images
   - Runs tests
   - Pushes to GCR
   - Deploys to Cloud Run
   - Runs database migrations

## Monitoring

### View Logs

```bash
# Backend logs
gcloud run services logs read jobbuddy-backend --region=us-central1

# Frontend logs
gcloud run services logs read jobbuddy-frontend --region=us-central1

# Build logs
gcloud builds list --limit=10
```

### Health Checks

- Backend: `https://jobbuddy-backend-REGION.a.run.app/health`
- Frontend: `https://jobbuddy-frontend-REGION.a.run.app/health`

## Troubleshooting

### Build Fails

```bash
# Check build logs
gcloud builds log BUILD_ID

# Common issues:
# - Missing secrets
# - Incorrect substitution variables
# - Test failures
```

### Deployment Fails

```bash
# Check service status
gcloud run services describe jobbuddy-backend --region=us-central1

# Common issues:
# - Port mismatch (must be 8080)
# - Missing environment variables
# - Database connection issues
```

### Database Connection Issues

```bash
# Test Cloud SQL connection
gcloud sql connect jobbuddy-db --user=postgres

# Check Cloud SQL proxy
gcloud sql instances describe jobbuddy-db
```

## Cost Optimization

- **Cloud Run**: Pay per request, scales to zero
- **Cloud SQL**: Use smallest tier (db-f1-micro) for dev
- **Container Registry**: Clean up old images regularly

```bash
# Delete old images
gcloud container images list-tags gcr.io/PROJECT_ID/jobbuddy-backend \
    --filter="timestamp.datetime < '2024-01-01'" \
    --format="get(digest)" | \
    xargs -I {} gcloud container images delete "gcr.io/PROJECT_ID/jobbuddy-backend@{}" --quiet
```

## Security Best Practices

1. ✅ Use Secret Manager for all sensitive data
2. ✅ Enable Cloud Armor for DDoS protection
3. ✅ Use VPC for database isolation
4. ✅ Enable Cloud Audit Logs
5. ✅ Implement least privilege IAM roles
6. ✅ Use custom service accounts

## Next Steps

- [ ] Set up custom domain
- [ ] Configure CDN
- [ ] Enable Cloud Armor
- [ ] Set up monitoring alerts
- [ ] Configure backup strategy
- [ ] Implement blue-green deployments

## Support

- [GCP Documentation](https://cloud.google.com/docs)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
