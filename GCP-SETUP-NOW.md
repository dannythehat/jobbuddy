# 🚀 GCP Setup - Start Now

## Current Status
- ✅ GitHub Actions workflow created
- ✅ Project ID: `algebraic-link-476405-e9`
- ✅ Region: `europe-west1`
- ⚠️ Need: Service account permissions

## Step 1: Fix Service Account Permissions (5 min)

```bash
# Set your project
gcloud config set project algebraic-link-476405-e9

# Grant necessary permissions to compute service account
PROJECT_NUMBER=$(gcloud projects describe algebraic-link-476405-e9 --format="value(projectNumber)")

gcloud projects add-iam-policy-binding algebraic-link-476405-e9 \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding algebraic-link-476405-e9 \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/run.admin"
```

## Step 2: Create GitHub Secret for Deployment

```bash
# Create service account for GitHub Actions
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Deployer"

# Grant permissions
gcloud projects add-iam-policy-binding algebraic-link-476405-e9 \
  --member="serviceAccount:github-actions@algebraic-link-476405-e9.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding algebraic-link-476405-e9 \
  --member="serviceAccount:github-actions@algebraic-link-476405-e9.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding algebraic-link-476405-e9 \
  --member="serviceAccount:github-actions@algebraic-link-476405-e9.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Create key
gcloud iam service-accounts keys create github-actions-key.json \
  --iam-account=github-actions@algebraic-link-476405-e9.iam.gserviceaccount.com

# Copy the contents of github-actions-key.json
cat github-actions-key.json
```

## Step 3: Add Secret to GitHub

1. Go to: https://github.com/dannythehat/jobbuddy/settings/secrets/actions
2. Click "New repository secret"
3. Name: `GCP_SA_KEY`
4. Value: Paste the entire contents of `github-actions-key.json`
5. Click "Add secret"

## Step 4: Create GCP Secrets (if not exists)

```bash
# Check existing secrets
gcloud secrets list

# Create if needed
echo -n "your_db_password" | gcloud secrets create jobbuddy-db-password --data-file=-
echo -n "your_jwt_secret_min_32_chars" | gcloud secrets create jobbuddy-jwt-secret --data-file=-
echo -n "sk-your-openai-key" | gcloud secrets create jobbuddy-openai-key --data-file=-
echo -n "your_encryption_key_32_chars" | gcloud secrets create jobbuddy-encryption-key --data-file=-

# Grant access to compute service account
for secret in jobbuddy-db-password jobbuddy-jwt-secret jobbuddy-openai-key jobbuddy-encryption-key; do
  gcloud secrets add-iam-policy-binding $secret \
    --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
done
```

## Step 5: Build and Push Docker Images

```bash
# Authenticate Docker
gcloud auth configure-docker gcr.io

# Build backend
cd backend
docker build -t gcr.io/algebraic-link-476405-e9/jobbuddy-backend:latest .
docker push gcr.io/algebraic-link-476405-e9/jobbuddy-backend:latest

# Build frontend
cd ../frontend
docker build -t gcr.io/algebraic-link-476405-e9/jobbuddy-frontend:latest .
docker push gcr.io/algebraic-link-476405-e9/jobbuddy-frontend:latest
```

## Step 6: Deploy via GitHub Actions

```bash
# Push to main branch to trigger deployment
git add .
git commit -m "Trigger GCP deployment"
git push origin main
```

## Quick Deploy (Alternative)

Once permissions are set, I can deploy directly via Bhindi!

## Next Steps After Deployment

- [ ] Verify backend: https://jobbuddy-backend-[hash].a.run.app/health
- [ ] Verify frontend: https://jobbuddy-frontend-[hash].a.run.app
- [ ] Set up custom domain
- [ ] Configure Cloud SQL
- [ ] Run database migrations

## Need Help?

Run these commands and share the output:
```bash
gcloud config get-value project
gcloud secrets list
gcloud run services list --region=europe-west1
```
