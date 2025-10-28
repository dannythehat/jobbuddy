#!/bin/bash
# Validate GCP Deployment
# Tests all services and endpoints after deployment

set -e

PROJECT_ID=$(gcloud config get-value project)
REGION=${1:-us-central1}

echo "🧪 JobBuddy GCP Deployment Validation"
echo "======================================"
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected_status=${3:-200}
    
    echo -n "Testing $name... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $response)"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $response, expected $expected_status)"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Get service URLs
echo "📡 Fetching service URLs..."
BACKEND_URL=$(gcloud run services describe jobbuddy-backend --region=$REGION --format="value(status.url)" 2>/dev/null || echo "")
FRONTEND_URL=$(gcloud run services describe jobbuddy-frontend --region=$REGION --format="value(status.url)" 2>/dev/null || echo "")

if [ -z "$BACKEND_URL" ]; then
    echo -e "${RED}✗ Backend service not found${NC}"
    exit 1
fi

if [ -z "$FRONTEND_URL" ]; then
    echo -e "${RED}✗ Frontend service not found${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Backend URL: $BACKEND_URL${NC}"
echo -e "${GREEN}✓ Frontend URL: $FRONTEND_URL${NC}"
echo ""

# Test Backend
echo "🔧 Testing Backend Service"
echo "-------------------------"
test_endpoint "Backend Health" "$BACKEND_URL/health"
test_endpoint "Backend Ready" "$BACKEND_URL/ready"
echo ""

# Test Frontend
echo "🎨 Testing Frontend Service"
echo "--------------------------"
test_endpoint "Frontend Health" "$FRONTEND_URL/health"
test_endpoint "Frontend Root" "$FRONTEND_URL/"
echo ""

# Test Cloud SQL
echo "🗄️  Testing Cloud SQL Connection"
echo "-------------------------------"
SQL_INSTANCE=$(gcloud sql instances list --filter="name:jobbuddy-db" --format="value(name)" 2>/dev/null || echo "")

if [ -n "$SQL_INSTANCE" ]; then
    echo -e "${GREEN}✓ Cloud SQL instance found: $SQL_INSTANCE${NC}"
    ((TESTS_PASSED++))
    
    SQL_STATUS=$(gcloud sql instances describe $SQL_INSTANCE --format="value(state)" 2>/dev/null || echo "")
    if [ "$SQL_STATUS" = "RUNNABLE" ]; then
        echo -e "${GREEN}✓ Cloud SQL instance is running${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ Cloud SQL instance status: $SQL_STATUS${NC}"
        ((TESTS_FAILED++))
    fi
else
    echo -e "${RED}✗ Cloud SQL instance not found${NC}"
    ((TESTS_FAILED++))
fi
echo ""

# Test Secrets
echo "🔐 Testing Secret Manager"
echo "------------------------"
SECRETS=("jobbuddy-db-password" "jobbuddy-jwt-secret" "jobbuddy-openai-key" "jobbuddy-encryption-key")

for secret in "${SECRETS[@]}"; do
    if gcloud secrets describe $secret &>/dev/null; then
        echo -e "${GREEN}✓ Secret exists: $secret${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ Secret missing: $secret${NC}"
        ((TESTS_FAILED++))
    fi
done
echo ""

# Test Storage Buckets
echo "💾 Testing Cloud Storage"
echo "-----------------------"
BUCKETS=("${PROJECT_ID}-jobbuddy-cvs" "${PROJECT_ID}-jobbuddy-backups")

for bucket in "${BUCKETS[@]}"; do
    if gsutil ls -b "gs://$bucket" &>/dev/null; then
        echo -e "${GREEN}✓ Bucket exists: $bucket${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${YELLOW}⚠ Bucket not found: $bucket${NC}"
    fi
done
echo ""

# Summary
echo "📊 Test Summary"
echo "==============="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! Deployment is healthy.${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please review the output above.${NC}"
    exit 1
fi
