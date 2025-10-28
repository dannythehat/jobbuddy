# GCP Deployment Checklist

## Pre-Deployment Setup

### 1. GCP Project Setup
- [ ] Create GCP project
- [ ] Enable billing
- [ ] Install gcloud CLI
- [ ] Run `./scripts/setup-gcp.sh`

### 2. Enable APIs
- [ ] Cloud Run API
- [ ] Cloud SQL Admin API
- [ ] Secret Manager API
- [ ] Container Registry API
- [ ] Cloud Build API

### 3. Create Cloud SQL Instance
- [ ] Create PostgreSQL instance
- [ ] Create database: `jobbuddy_prod`
- [ ] Create user: `jobbuddy_user`
- [ ] Note connection name: `PROJECT_ID:REGION:INSTANCE_NAME`

### 4. Create Secrets
- [ ] Run `./scripts/create-secrets.sh`
- [ ] Verify secrets created:
  - jobbuddy-db-password
  - jobbuddy-jwt-secret
  - jobbuddy-openai-key
  - jobbuddy-encryption-key

### 5. Configure Cloud Build
- [ ] Connect GitHub repository
- [ ] Create Cloud Build trigger
- [ ] Set substitution variables:
  - `_REGION`: us-central1
  - `_CLOUDSQL_INSTANCE`: PROJECT_ID:REGION:INSTANCE_NAME

## Deployment

### 6. Update Configuration
- [ ] Update `cloudbuild.yaml` substitutions with your values
- [ ] Update `backend/.env.example` with GCP values
- [ ] Update `frontend/.env.example` with backend URL

### 7. Deploy
- [ ] Push to main branch
- [ ] Monitor Cloud Build logs
- [ ] Verify backend deployment
- [ ] Verify frontend deployment

### 8. Post-Deployment
- [ ] Test health endpoints
- [ ] Run database migrations
- [ ] Test API endpoints
- [ ] Test frontend application

## Verification

### Health Checks
```bash
# Backend health
curl https://jobbuddy-backend-REGION.a.run.app/health

# Frontend health
curl https://jobbuddy-frontend-REGION.a.run.app/health
```

### Service URLs
```bash
# Get backend URL
gcloud run services describe jobbuddy-backend --region=REGION --format="value(status.url)"

# Get frontend URL
gcloud run services describe jobbuddy-frontend --region=REGION --format="value(status.url)"
```

## Troubleshooting

### Build Fails
- Check Cloud Build logs
- Verify all secrets exist
- Check substitution variables

### Deployment Fails
- Check Cloud Run logs
- Verify port 8080
- Check environment variables
- Verify Cloud SQL connection

### Database Connection Issues
- Verify Cloud SQL instance is running
- Check connection name format
- Verify secrets are accessible
- Test Cloud SQL proxy locally

## Cost Optimization

- [ ] Set min-instances=0 for auto-scaling to zero
- [ ] Use smallest Cloud SQL tier for dev
- [ ] Clean up old container images
- [ ] Monitor usage in GCP Console

## Security

- [ ] All secrets in Secret Manager
- [ ] Cloud Run services use least privilege
- [ ] Enable Cloud Armor (optional)
- [ ] Set up VPC connector (optional)
- [ ] Configure custom domain with SSL

## Next Steps

- [ ] Set up custom domain
- [ ] Configure CDN
- [ ] Set up monitoring alerts
- [ ] Configure backup strategy
- [ ] Implement blue-green deployments
