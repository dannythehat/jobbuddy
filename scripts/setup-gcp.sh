#!/bin/bash
# GCP Project Setup Script for JobBuddy
# This script sets up all required GCP resources

set -e

echo "🚀 JobBuddy GCP Setup Script"
echo "================================"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ ERROR: gcloud CLI is not installed"
    echo "Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get project ID
read -p "Enter your GCP Project ID: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo "❌ ERROR: Project ID cannot be empty"
    exit 1
fi

echo "📦 Setting project: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Get region
read -p "Enter your preferred region (default: us-central1): " REGION
REGION=${REGION:-us-central1}

echo "🌍 Using region: $REGION"

# Enable required APIs
echo "🔧 Enabling required GCP APIs..."
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    sqladmin.googleapis.com \
    secretmanager.googleapis.com \
    containerregistry.googleapis.com \
    cloudresourcemanager.googleapis.com

echo "✅ APIs enabled"

# Create Cloud SQL instance
echo "🗄️  Creating Cloud SQL instance..."
read -p "Create Cloud SQL instance? (y/n): " CREATE_SQL

if [ "$CREATE_SQL" = "y" ]; then
    read -p "Enter Cloud SQL instance name (default: jobbuddy-db): " SQL_INSTANCE
    SQL_INSTANCE=${SQL_INSTANCE:-jobbuddy-db}
    
    gcloud sql instances create $SQL_INSTANCE \
        --database-version=POSTGRES_14 \
        --tier=db-f1-micro \
        --region=$REGION \
        --root-password=$(openssl rand -base64 32)
    
    echo "✅ Cloud SQL instance created: $SQL_INSTANCE"
fi

echo "🎉 GCP setup complete!"
echo ""
echo "Next steps:"
echo "1. Create secrets in Secret Manager"
echo "2. Set up Cloud Build trigger"
echo "3. Configure environment variables"
