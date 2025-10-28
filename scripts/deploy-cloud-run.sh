#!/bin/bash
# Quick Cloud Run Deployment Script

set -e

echo "🚀 Starting JobBuddy Cloud Run Deployment..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get project ID
PROJECT_ID=$(gcloud config get-value project)
REGION="us-central1"

echo -e "${BLUE}Project: $PROJECT_ID${NC}"
echo -e "${BLUE}Region: $REGION${NC}"

# Step 1: Submit build
echo -e "\n${BLUE}Step 1: Submitting build to Cloud Build...${NC}"
gcloud builds submit --config=cloudbuild.yaml

# Step 2: Wait for deployment
echo -e "\n${BLUE}Step 2: Waiting for deployment to complete...${NC}"
sleep 10

# Step 3: Get service URLs
echo -e "\n${BLUE}Step 3: Getting service URLs...${NC}"
BACKEND_URL=$(gcloud run services describe jobbuddy-backend \
  --region=$REGION \
  --format='value(status.url)' 2>/dev/null || echo "Not deployed")

FRONTEND_URL=$(gcloud run services describe jobbuddy-frontend \
  --region=$REGION \
  --format='value(status.url)' 2>/dev/null || echo "Not deployed")

# Step 4: Test health endpoints
echo -e "\n${BLUE}Step 4: Testing health endpoints...${NC}"

if [ "$BACKEND_URL" != "Not deployed" ]; then
  echo "Testing backend: $BACKEND_URL/health"
  HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BACKEND_URL/health)
  
  if [ "$HEALTH_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Backend health check passed${NC}"
  else
    echo -e "${RED}❌ Backend health check failed (Status: $HEALTH_STATUS)${NC}"
  fi
else
  echo -e "${RED}❌ Backend not deployed${NC}"
fi

# Step 5: Display results
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Backend URL:${NC} $BACKEND_URL"
echo -e "${BLUE}Frontend URL:${NC} $FRONTEND_URL"
echo ""
echo -e "${BLUE}View logs:${NC}"
echo "  gcloud run services logs read jobbuddy-backend --region=$REGION"
echo ""
echo -e "${BLUE}View services:${NC}"
echo "  gcloud run services list --region=$REGION"
echo ""
echo -e "${BLUE}Test API:${NC}"
echo "  curl $BACKEND_URL/api/health"
echo ""

# Step 6: Show recent logs
echo -e "\n${BLUE}Recent logs:${NC}"
gcloud run services logs read jobbuddy-backend \
  --region=$REGION \
  --limit=10 2>/dev/null || echo "No logs available yet"

echo -e "\n${GREEN}✅ Deployment script complete!${NC}"
