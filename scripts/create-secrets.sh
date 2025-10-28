#!/bin/bash
# Create GCP Secrets for JobBuddy
# This script creates all required secrets in Secret Manager

set -e

echo "🔐 Creating GCP Secrets for JobBuddy"
echo "====================================="

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ ERROR: gcloud CLI is not installed"
    exit 1
fi

PROJECT_ID=$(gcloud config get-value project)
echo "📦 Project: $PROJECT_ID"

# Function to create secret
create_secret() {
    local secret_name=$1
    local secret_description=$2
    
    echo ""
    read -sp "Enter $secret_description: " secret_value
    echo ""
    
    if [ -z "$secret_value" ]; then
        echo "⚠️  Skipping $secret_name (empty value)"
        return
    fi
    
    # Check if secret exists
    if gcloud secrets describe $secret_name &>/dev/null; then
        echo "📝 Updating existing secret: $secret_name"
        echo -n "$secret_value" | gcloud secrets versions add $secret_name --data-file=-
    else
        echo "✨ Creating new secret: $secret_name"
        echo -n "$secret_value" | gcloud secrets create $secret_name --data-file=-
    fi
    
    echo "✅ $secret_name created/updated"
}

# Create all secrets
echo ""
echo "Creating required secrets..."
echo ""

create_secret "jobbuddy-db-password" "Database Password"
create_secret "jobbuddy-jwt-secret" "JWT Secret (min 32 characters)"
create_secret "jobbuddy-openai-key" "OpenAI API Key"
create_secret "jobbuddy-encryption-key" "Encryption Key"

echo ""
echo "Creating optional secrets..."
echo ""

create_secret "jobbuddy-google-client-id" "Google OAuth Client ID (optional)"
create_secret "jobbuddy-google-client-secret" "Google OAuth Client Secret (optional)"
create_secret "jobbuddy-redis-password" "Redis Password (optional)"
create_secret "jobbuddy-smtp-password" "SMTP Password (optional)"

echo ""
echo "🎉 Secrets created successfully!"
echo ""
echo "Granting access to Cloud Build service account..."

PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
SERVICE_ACCOUNT="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

# Grant access to all secrets
for secret in jobbuddy-db-password jobbuddy-jwt-secret jobbuddy-openai-key jobbuddy-encryption-key; do
    gcloud secrets add-iam-policy-binding $secret \
        --member="serviceAccount:$SERVICE_ACCOUNT" \
        --role="roles/secretmanager.secretAccessor" \
        --quiet
    echo "✅ Granted access to $secret"
done

echo ""
echo "🎉 Setup complete!"
