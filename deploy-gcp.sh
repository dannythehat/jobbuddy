#!/bin/bash
set -e

# JobBuddy GCP Deployment Script - Belgian Region (europe-west1)
# This script deploys your entire application to GCP

REGION="europe-west1"
PROJECT_ID=$(gcloud config get-value project)

echo "🚀 Deploying JobBuddy to GCP (Belgian Region)"
echo "Project: $PROJECT_ID"
echo "Region: $REGION"

# Step 1: Create Cloud SQL Database (if not exists)
echo "📊 Setting up Cloud SQL database..."
if ! gcloud sql instances describe jobbuddy-db &>/dev/null; then
    gcloud sql instances create jobbuddy-db \
        --database-version=POSTGRES_14 \
        --tier=db-f1-micro \
        --region=$REGION \
        --storage-type=SSD \
        --storage-size=10GB \
        --backup \
        --backup-start-time=03:00
    
    echo "✅ Database created"
    
    # Create database
    gcloud sql databases create jobbuddy --instance=jobbuddy-db
    echo "✅ Database 'jobbuddy' created"
else
    echo "✅ Database already exists"
fi

# Step 2: Create secrets (if not exists)
echo "🔐 Setting up secrets..."

if ! gcloud secrets describe jobbuddy-jwt-secret &>/dev/null; then
    echo -n "$(openssl rand -hex 32)" | gcloud secrets create jobbuddy-jwt-secret --data-file=-
    echo "✅ JWT secret created"
fi

if ! gcloud secrets describe jobbuddy-db-password &>/dev/null; then
    DB_PASSWORD=$(openssl rand -base64 32)
    echo -n "$DB_PASSWORD" | gcloud secrets create jobbuddy-db-password --data-file=-
    
    # Set database password
    gcloud sql users set-password postgres \
        --instance=jobbuddy-db \
        --password="$DB_PASSWORD"
    echo "✅ Database password created and set"
fi

if ! gcloud secrets describe jobbuddy-encryption-key &>/dev/null; then
    echo -n "$(openssl rand -hex 32)" | gcloud secrets create jobbuddy-encryption-key --data-file=-
    echo "✅ Encryption key created"
fi

# Check for OpenAI key
if ! gcloud secrets describe jobbuddy-openai-key &>/dev/null; then
    echo "⚠️  OpenAI API key not found. Please create it:"
    echo "   echo -n 'your-openai-key' | gcloud secrets create jobbuddy-openai-key --data-file=-"
    read -p "Press enter to continue or Ctrl+C to exit..."
fi

# Step 3: Build and Deploy
echo "🏗️  Building and deploying application..."

# Update cloudbuild.yaml region
sed -i "s/_REGION: 'us-central1'/_REGION: '$REGION'/g" cloudbuild.yaml

# Submit build
gcloud builds submit \
    --config=cloudbuild.yaml \
    --substitutions=_REGION=$REGION,_CLOUDSQL_INSTANCE=$PROJECT_ID:$REGION:jobbuddy-db

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your application URLs:"
echo "Backend:  https://jobbuddy-backend-$(echo $REGION | tr -d '-')-$(gcloud config get-value project | cut -c1-8).a.run.app"
echo "Frontend: https://jobbuddy-frontend-$(echo $REGION | tr -d '-')-$(gcloud config get-value project | cut -c1-8).a.run.app"
echo ""
echo "📊 View logs:"
echo "gcloud run services logs read jobbuddy-backend --region=$REGION"
echo ""
