# GCP Master Roadmap - JobBuddy

**Project**: JobBuddy  
**GCP Project**: jobbuddi  
**Region**: europe-west1 (Belgium)  
**Last Updated**: 2025-10-29

---

## Quick Links

- **GitHub Repo**: https://github.com/dannythehat/jobbuddy
- **This File**: https://github.com/dannythehat/jobbuddy/blob/main/GCP-MASTER-ROADMAP.md
- **Deploy Script**: `./deploy-gcp.sh`
- **GCP Console**: https://console.cloud.google.com

---

## Current Status

### Infrastructure
- [x] Dockerfiles optimized for Cloud Run
- [x] GitHub Actions CI/CD pipeline
- [x] Cloud Build configuration
- [x] Deployment scripts
- [ ] Services deployed to Cloud Run
- [ ] Database configured
- [ ] Secrets created

### Services Status
- **Backend**: Not deployed
- **Frontend**: Not deployed  
- **Database**: Not created
- **Secrets**: Not configured

---

## Phase 1: Initial Setup (CURRENT)

### 1.1 GCP Project Setup
- [x] Project created: jobbuddi
- [x] Region selected: europe-west1
- [ ] Billing enabled
- [ ] APIs enabled

### 1.2 Enable Required APIs
```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 1.3 Create Cloud SQL Database
```bash
gcloud sql instances create jobbuddy-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=europe-west1

gcloud sql databases create jobbuddy --instance=jobbuddy-db
```

### 1.4 Create Secrets
```bash
./scripts/create-secrets.sh
```

---

## Phase 2: First Deployment

### 2.1 Deploy Using Script
```bash
chmod +x deploy-gcp.sh
./deploy-gcp.sh
```

### 2.2 Verify Deployment
```bash
gcloud run services list --region=europe-west1
```

### 2.3 Test Services
```bash
# Get URLs
BACKEND_URL=$(gcloud run services describe jobbuddy-backend --region=europe-west1 --format='value(status.url)')
FRONTEND_URL=$(gcloud run services describe jobbuddy-frontend --region=europe-west1 --format='value(status.url)')

# Test health
curl $BACKEND_URL/health
curl $FRONTEND_URL/health
```

---

## Phase 3: Database Setup

### 3.1 Run Migrations
```bash
# Connect to Cloud SQL
gcloud sql connect jobbuddy-db --user=postgres

# Or run migrations via Cloud Run job
gcloud builds submit --config=cloudbuild.yaml
```

### 3.2 Seed Data (Optional)
```bash
# Add seed data script
```

---

## Phase 4: Domain & SSL

### 4.1 Custom Domain
```bash
gcloud run domain-mappings create \
  --service=jobbuddy-frontend \
  --domain=yourdomain.com \
  --region=europe-west1
```

### 4.2 SSL Certificate
- Automatic via Cloud Run

---

## Phase 5: Monitoring & Alerts

### 5.1 Set Up Monitoring
```bash
./monitoring/setup-monitoring.sh
```

### 5.2 Configure Alerts
- CPU usage > 80%
- Memory usage > 80%
- Error rate > 5%
- Response time > 2s

---

## Phase 6: Optimization

### 6.1 Performance
- [ ] Enable CDN
- [ ] Configure caching
- [ ] Optimize images
- [ ] Add Redis cache

### 6.2 Cost Optimization
- [ ] Review instance sizes
- [ ] Set up auto-scaling
- [ ] Configure min instances
- [ ] Review storage usage

---

## Application Features Status

### Core Features
- [x] User authentication
- [x] Job search
- [x] Application tracking
- [x] CV parsing
- [x] Email monitoring
- [x] Interview scheduling

### Phase 6.1 - Natural Language Search
- [x] Backend API complete
- [x] Frontend UI integrated
- [ ] Deployed to production

### Phase 7 - Job Snapshot & Summarizer
- [ ] Backend implementation
- [ ] Frontend integration
- [ ] Testing
- [ ] Deployment

---

## Next Steps (Priority Order)

1. **Enable GCP APIs** (5 min)
2. **Create Cloud SQL database** (10 min)
3. **Create secrets** (5 min)
4. **Run deploy script** (15 min)
5. **Verify deployment** (5 min)
6. **Test application** (10 min)

**Total Time**: ~50 minutes

---

## Deployment Commands

### Quick Deploy
```bash
./deploy-gcp.sh
```

### Manual Deploy
```bash
# Build and deploy
gcloud builds submit --config=cloudbuild.yaml

# Check status
gcloud run services list --region=europe-west1

# View logs
gcloud run services logs read jobbuddy-backend --region=europe-west1
```

---

## Troubleshooting

### Common Issues

**1. Build Fails**
```bash
# Check build logs
gcloud builds list --limit=5
gcloud builds log BUILD_ID
```

**2. Service Not Starting**
```bash
# Check service logs
gcloud run services logs read jobbuddy-backend --region=europe-west1 --limit=50
```

**3. Database Connection Issues**
```bash
# Test connection
gcloud sql connect jobbuddy-db --user=postgres
```

---

## Cost Tracking

### Current Monthly Estimate
- Cloud Run Backend: €5-15
- Cloud Run Frontend: €2-5
- Cloud SQL: €10-30
- Container Registry: €1-3
- **Total**: €18-53/month

### Cost Optimization Tips
- Services scale to zero when idle
- Use smallest DB tier for dev
- Clean up old container images
- Monitor usage regularly

---

## Security Checklist

- [ ] Secrets in Secret Manager
- [ ] IAM roles configured
- [ ] VPC for database
- [ ] HTTPS only
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Security headers set

---

## Backup & Recovery

### Database Backups
```bash
# Automated daily backups at 3 AM
# Retention: 7 days
```

### Manual Backup
```bash
gcloud sql backups create --instance=jobbuddy-db
```

### Restore
```bash
gcloud sql backups restore BACKUP_ID --backup-instance=jobbuddy-db
```

---

## Team Access

### Add Team Member
```bash
gcloud projects add-iam-policy-binding jobbuddi \
  --member=user:email@example.com \
  --role=roles/run.developer
```

---

## Updates Log

### 2025-10-29
- Created master roadmap
- Configured Belgium region
- Set up deployment scripts
- Ready for first deployment

---

## Resources

- [GCP Console](https://console.cloud.google.com)
- [Cloud Run Docs](https://cloud.google.com/run/docs)
- [Cloud SQL Docs](https://cloud.google.com/sql/docs)
- [GitHub Repo](https://github.com/dannythehat/jobbuddy)

---

**Start Here**: Run `./deploy-gcp.sh` to deploy everything!
