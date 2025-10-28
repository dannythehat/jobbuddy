#!/bin/bash
# Setup Cloud Monitoring for JobBuddy
# Creates alert policies and uptime checks

set -e

PROJECT_ID=$(gcloud config get-value project)
REGION="us-central1"

echo "🔍 Setting up Cloud Monitoring for JobBuddy"
echo "Project: $PROJECT_ID"
echo "Region: $REGION"

# Get Cloud Run service URLs
BACKEND_URL=$(gcloud run services describe jobbuddy-backend --region=$REGION --format="value(status.url)" 2>/dev/null || echo "")
FRONTEND_URL=$(gcloud run services describe jobbuddy-frontend --region=$REGION --format="value(status.url)" 2>/dev/null || echo "")

if [ -z "$BACKEND_URL" ]; then
    echo "⚠️  Backend service not found. Deploy first."
    exit 1
fi

if [ -z "$FRONTEND_URL" ]; then
    echo "⚠️  Frontend service not found. Deploy first."
    exit 1
fi

echo "Backend URL: $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"

# Create uptime check for backend
echo "Creating uptime check for backend..."
gcloud monitoring uptime create jobbuddy-backend-health \
    --resource-type=uptime-url \
    --host="$BACKEND_URL" \
    --path="/health" \
    --check-interval=60s \
    --timeout=10s \
    --display-name="JobBuddy Backend Health Check" || echo "Uptime check may already exist"

# Create uptime check for frontend
echo "Creating uptime check for frontend..."
gcloud monitoring uptime create jobbuddy-frontend-health \
    --resource-type=uptime-url \
    --host="$FRONTEND_URL" \
    --path="/health" \
    --check-interval=60s \
    --timeout=10s \
    --display-name="JobBuddy Frontend Health Check" || echo "Uptime check may already exist"

echo "✅ Monitoring setup complete!"
echo ""
echo "View monitoring dashboard:"
echo "https://console.cloud.google.com/monitoring/dashboards?project=$PROJECT_ID"
