# 🚀 GCP Deployment Quick Start

Deploy JobBuddy to Google Cloud Platform in under 30 minutes!

## Prerequisites

- GCP account with billing enabled
- `gcloud` CLI installed
- GitHub repository access
- Domain name (optional)

## 🎯 One-Command Deployment

```bash
# Clone repository
git clone https://github.com/dannythehat/jobbuddy.git
cd jobbuddy

# Run setup script
chmod +x scripts/setup-gcp.sh
./scripts/setup-gcp.sh

# Create secrets
chmod +x scripts/create-secrets.sh
./scripts/create-secrets.sh

# Deploy via Cloud Build
gcloud builds submit --config=cloudbuild.yaml
```

## 📋 Step-by-Step Guide

### 1. Setup GCP Project (5 minutes)

```bash
# Set your project ID
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    sqladmin.googleapis.com \
    secretmanager.googleapis.com
```

### 2. Create Infrastructure (10 minutes)

**Option A: Using Terraform (Recommended)**

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

**Option B: Using Scripts**

```bash
./scripts/setup-gcp.sh
```

### 3. Store Secrets (5 minutes)

```bash
./scripts/create-secrets.sh
```

You'll be prompted for:
- Database password
- JWT secret
- OpenAI API key
- Encryption key

### 4. Deploy Application (10 minutes)

**Option A: Cloud Build (Automated)**

```bash
# Create Cloud Build trigger
gcloud builds triggers create github \
    --repo-name=jobbuddy \
    --repo-owner=YOUR_GITHUB_USERNAME \
    --branch-pattern="^main$" \
    --build-config=cloudbuild.yaml

# Push to trigger deployment
git push origin main
```

**Option B: Manual Build**

```bash
gcloud builds submit --config=cloudbuild.yaml
```

### 5. Verify Deployment (2 minutes)

```bash
chmod +x scripts/validate-deployment.sh
./scripts/validate-deployment.sh
```

## 🌐 Access Your Application

```bash
# Get URLs
gcloud run services describe jobbuddy-backend --region=us-central1 --format="value(status.url)"
gcloud run services describe jobbuddy-frontend --region=us-central1 --format="value(status.url)"
```

## 📊 Architecture

```
┌─────────────────┐
│   GitHub Repo   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Cloud Build    │ ← Automated CI/CD
└────────┬────────┘
         │
         ├──────────────┬──────────────┐
         ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Backend    │ │   Frontend   │ │  Cloud SQL   │
│  Cloud Run   │ │  Cloud Run   │ │  PostgreSQL  │
└──────────────┘ └──────────────┘ └──────────────┘
         │              │              │
         └──────────────┴──────────────┘
                        │
                        ▼
                ┌──────────────┐
                │Secret Manager│
                └──────────────┘
```

## 💰 Cost Estimate

**Monthly costs with default configuration:**

- Cloud Run (Backend): $5-15
- Cloud Run (Frontend): $2-5
- Cloud SQL (db-f1-micro): $10-15
- Secret Manager: Free tier
- Cloud Storage: $1-5
- **Total: ~$20-40/month**

Scales to zero when not in use!

## 🔧 Configuration

### Environment Variables

Backend secrets are auto-injected from Secret Manager:
- `DB_PASSWORD`
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `ENCRYPTION_KEY`

### Custom Domain

```bash
# Map custom domain
gcloud run domain-mappings create \
    --service=jobbuddy-frontend \
    --domain=yourdomain.com \
    --region=us-central1
```

### Scaling

```bash
# Update backend scaling
gcloud run services update jobbuddy-backend \
    --min-instances=1 \
    --max-instances=20 \
    --region=us-central1
```

## 🔍 Monitoring

```bash
# Setup monitoring
chmod +x monitoring/setup-monitoring.sh
./monitoring/setup-monitoring.sh

# View logs
gcloud run services logs read jobbuddy-backend --region=us-central1
```

## 🐛 Troubleshooting

### Build Fails

```bash
# Check build logs
gcloud builds list --limit=5
gcloud builds log BUILD_ID
```

### Service Not Accessible

```bash
# Check service status
gcloud run services describe jobbuddy-backend --region=us-central1

# Check logs
gcloud run services logs read jobbuddy-backend --region=us-central1 --limit=50
```

### Database Connection Issues

```bash
# Test Cloud SQL connection
gcloud sql connect jobbuddy-db --user=postgres

# Check instance status
gcloud sql instances describe jobbuddy-db
```

## 📚 Additional Resources

- [Full GCP Deployment Guide](GCP-DEPLOYMENT.md)
- [Infrastructure Setup](GCP-INFRASTRUCTURE.md)
- [Deployment Checklist](GCP-DEPLOYMENT-CHECKLIST.md)
- [Terraform Configuration](terraform/README.md)

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/dannythehat/jobbuddy/issues)
- **Docs**: [Full Documentation](docs/)
- **Email**: danny@ai-on-auto.com

---

**🎉 You're ready to deploy JobBuddy to production!**
