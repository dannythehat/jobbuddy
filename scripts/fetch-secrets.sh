#!/bin/bash
# Fetch Secrets from GCP Secret Manager
# This script retrieves secrets at deployment/runtime

set -e

echo "🔐 Fetching secrets from GCP Secret Manager..."

# Check if gcloud is available
if ! command -v gcloud &> /dev/null; then
    echo "❌ ERROR: gcloud CLI is not installed"
    exit 1
fi

# Get project ID
PROJECT_ID=$(gcloud config get-value project)

if [ -z "$PROJECT_ID" ]; then
    echo "❌ ERROR: GCP project ID is not set"
    exit 1
fi

echo "📦 Project ID: $PROJECT_ID"

# Function to fetch secret
fetch_secret() {
    local secret_name=$1
    local env_var_name=$2
    
    echo "Fetching $secret_name..."
    
    secret_value=$(gcloud secrets versions access latest --secret="$secret_name" --project="$PROJECT_ID" 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        export "$env_var_name"="$secret_value"
        echo "✅ $secret_name fetched successfully"
    else
        echo "⚠️  WARNING: Could not fetch $secret_name"
    fi
}

# Fetch all required secrets
fetch_secret "jobbuddy-db-password" "DB_PASSWORD"
fetch_secret "jobbuddy-jwt-secret" "JWT_SECRET"
fetch_secret "jobbuddy-openai-key" "OPENAI_API_KEY"
fetch_secret "jobbuddy-encryption-key" "ENCRYPTION_KEY"
fetch_secret "jobbuddy-google-client-id" "GOOGLE_CLIENT_ID"
fetch_secret "jobbuddy-google-client-secret" "GOOGLE_CLIENT_SECRET"
fetch_secret "jobbuddy-redis-password" "REDIS_PASSWORD"

# Optional secrets
fetch_secret "jobbuddy-smtp-password" "SMTP_PASS" || true
fetch_secret "jobbuddy-n8n-api-key" "N8N_API_KEY" || true

echo "🎉 Secrets fetched successfully!"

# Export secrets to .env file if needed
if [ "$WRITE_ENV_FILE" = "true" ]; then
    echo "📝 Writing secrets to .env file..."
    cat > .env << EOF
DB_PASSWORD=$DB_PASSWORD
JWT_SECRET=$JWT_SECRET
OPENAI_API_KEY=$OPENAI_API_KEY
ENCRYPTION_KEY=$ENCRYPTION_KEY
GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
REDIS_PASSWORD=$REDIS_PASSWORD
SMTP_PASS=$SMTP_PASS
N8N_API_KEY=$N8N_API_KEY
EOF
    echo "✅ .env file created"
fi
