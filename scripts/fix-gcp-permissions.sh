#!/bin/bash
# Quick GCP permissions fix for JobBuddy deployment

set -e

PROJECT_ID="algebraic-link-476405-e9"
REGION="europe-west1"

echo "🔧 Setting up GCP permissions for JobBuddy..."

# Set project
gcloud config set project $PROJECT_ID

# Get project number
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
echo "✓ Project number: $PROJECT_NUMBER"

# Grant permissions to compute service account
echo "📝 Granting permissions to compute service account..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser" \
  --quiet

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/run.admin" \
  --quiet

echo "✓ Compute service account permissions granted"

# Create GitHub Actions service account
echo "🤖 Creating GitHub Actions service account..."
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Deployer" \
  --quiet || echo "Service account already exists"

# Grant permissions to GitHub Actions SA
echo "📝 Granting permissions to GitHub Actions..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/run.admin" \
  --quiet

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/storage.admin" \
  --quiet

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser" \
  --quiet

echo "✓ GitHub Actions service account configured"

# Create key
echo "🔑 Creating service account key..."
gcloud iam service-accounts keys create github-actions-key.json \
  --iam-account=github-actions@${PROJECT_ID}.iam.gserviceaccount.com

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Add this key to GitHub Secrets as 'GCP_SA_KEY':"
echo "   https://github.com/dannythehat/jobbuddy/settings/secrets/actions"
echo ""
echo "2. Copy the key contents:"
echo "   cat github-actions-key.json"
echo ""
echo "3. Create GCP secrets (if not exists):"
echo "   ./scripts/create-secrets.sh"
echo ""
echo "4. Push to main to trigger deployment!"
