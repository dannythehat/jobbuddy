# 🚀 Deploy JobBuddy to GCP (Belgian Region)

## Quick Deploy

```bash
# Make script executable
chmod +x deploy-gcp.sh

# Run deployment
./deploy-gcp.sh
```

That's it! The script handles everything:
- ✅ Creates Cloud SQL database (if needed)
- ✅ Sets up all secrets
- ✅ Builds and deploys backend + frontend
- ✅ Runs database migrations

## Manual Steps (if you prefer)

### 1. Create Database
```bash
gcloud sql instances create jobbuddy-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=europe-west1

gcloud sql databases create jobbuddy --instance=jobbuddy-db
```

### 2. Create Secrets
```bash
# JWT Secret
echo -n "$(openssl rand -hex 32)" | gcloud secrets create jobbuddy-jwt-secret --data-file=-

# DB Password
echo -n "$(openssl rand -base64 32)" | gcloud secrets create jobbuddy-db-password --data-file=-

# Encryption Key
echo -n "$(openssl rand -hex 32)" | gcloud secrets create jobbuddy-encryption-key --data-file=-

# OpenAI Key (use your actual key)
echo -n "sk-your-key-here" | gcloud secrets create jobbuddy-openai-key --data-file=-
```

### 3. Deploy
```bash
gcloud builds submit --config=cloudbuild.yaml
```

## View Your App

After deployment completes:

```bash
# Get backend URL
gcloud run services describe jobbuddy-backend --region=europe-west1 --format="value(status.url)"

# Get frontend URL
gcloud run services describe jobbuddy-frontend --region=europe-west1 --format="value(status.url)"
```

## Troubleshooting

**View logs:**
```bash
gcloud run services logs read jobbuddy-backend --region=europe-west1 --limit=50
```

**Check service status:**
```bash
gcloud run services describe jobbuddy-backend --region=europe-west1
```

**Database connection:**
```bash
gcloud sql connect jobbuddy-db --user=postgres
```

## Cost

~€20-40/month, scales to €0 when idle.
