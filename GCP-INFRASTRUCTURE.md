# GCP Infrastructure Setup

**Part of:** GCP-MERGE.md
**Status:** Step-by-step guide
**Last Updated:** October 26, 2025

---

## 🏗️ PHASE 1: GCP PROJECT SETUP (Day 1)

### Step 1.1: Install GCP CLI & Create Project

```bash
# Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Initialize and login
gcloud init
gcloud auth login

# Create new project
gcloud projects create jobbuddi-prod --name="JobBuddi Production"

# Set as active project
gcloud config set project jobbuddi-prod

# Enable billing (required - do this in console)
# Visit: https://console.cloud.google.com/billing
```

### Step 1.2: Enable Required APIs

```bash
# Enable all necessary GCP services
gcloud services enable \
  compute.googleapis.com \
  sqladmin.googleapis.com \
  storage-api.googleapis.com \
  cloudscheduler.googleapis.com \
  secretmanager.googleapis.com \
  redis.googleapis.com \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  containerregistry.googleapis.com \
  cloudtasks.googleapis.com \
  gmail.googleapis.com
```

**✅ Checkpoint:** Run `gcloud services list --enabled` to verify all APIs are active.

---

## 🗄️ PHASE 2: DATABASE SETUP (Day 1-2)

### Step 2.1: Create Cloud SQL PostgreSQL Instance

```bash
# Create production database instance
gcloud sql instances create jobbuddi-db \
  --database-version=POSTGRES_15 \
  --tier=db-custom-2-7680 \
  --region=us-central1 \
  --storage-type=SSD \
  --storage-size=50GB \
  --storage-auto-increase \
  --backup-start-time=03:00 \
  --enable-bin-log \
  --maintenance-window-day=SUN \
  --maintenance-window-hour=4 \
  --availability-type=REGIONAL

# Create database
gcloud sql databases create jobbuddy --instance=jobbuddi-db

# Create database user
gcloud sql users create jobbuddi_user \
  --instance=jobbuddi-db \
  --password=$(openssl rand -base64 32)

# Save password to Secret Manager (we'll set this up next)
```

**✅ Checkpoint:** Run `gcloud sql instances describe jobbuddi-db` to verify instance is running.

### Step 2.2: Migrate Existing Data

```bash
# From your local machine where current DB is running

# Export current database
pg_dump -U postgres -d jobbuddy -F c -f jobbuddy_backup.dump

# Upload to Cloud Storage (we'll create bucket first)
gsutil mb -l us-central1 gs://jobbuddi-backups
gsutil cp jobbuddy_backup.dump gs://jobbuddi-backups/

# Import to Cloud SQL
gcloud sql import sql jobbuddi-db \
  gs://jobbuddi-backups/jobbuddy_backup.dump \
  --database=jobbuddy
```

**✅ Checkpoint:** Connect to Cloud SQL and verify tables exist:
```bash
gcloud sql connect jobbuddi-db --user=jobbuddi_user --database=jobbuddy
\dt  # List all tables
```

---

## 🔐 PHASE 3: SECRET MANAGER (Day 2)

### Step 3.1: Store All Secrets

```bash
# OpenAI API Key
echo -n "YOUR_OPENAI_API_KEY" | \
  gcloud secrets create openai-api-key --data-file=-

# Database Password
echo -n "YOUR_DB_PASSWORD" | \
  gcloud secrets create db-password --data-file=-

# JWT Secret
echo -n "$(openssl rand -base64 64)" | \
  gcloud secrets create jwt-secret --data-file=-

# Google OAuth Client ID & Secret
echo -n "YOUR_GOOGLE_CLIENT_ID" | \
  gcloud secrets create google-oauth-client-id --data-file=-
echo -n "YOUR_GOOGLE_CLIENT_SECRET" | \
  gcloud secrets create google-oauth-client-secret --data-file=-

# Session Secret
echo -n "$(openssl rand -base64 64)" | \
  gcloud secrets create session-secret --data-file=-
```

### Step 3.2: Grant Access to Cloud Run

```bash
# Get project number
PROJECT_NUMBER=$(gcloud projects describe jobbuddi-prod --format="value(projectNumber)")

# Grant secret access to default compute service account
for secret in openai-api-key db-password jwt-secret google-oauth-client-id google-oauth-client-secret session-secret; do
  gcloud secrets add-iam-policy-binding $secret \
    --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
done
```

**✅ Checkpoint:** List secrets: `gcloud secrets list`

---

## 💾 PHASE 4: CLOUD STORAGE (Day 2)

### Step 4.1: Create Storage Buckets

```bash
# CV uploads
gsutil mb -l us-central1 -c STANDARD gs://jobbuddi-cvs
gsutil uniformbucketlevelaccess set on gs://jobbuddi-cvs

# Certificates & awards
gsutil mb -l us-central1 -c STANDARD gs://jobbuddi-certificates
gsutil uniformbucketlevelaccess set on gs://jobbuddi-certificates

# Application documents
gsutil mb -l us-central1 -c STANDARD gs://jobbuddi-applications
gsutil uniformbucketlevelaccess set on gs://jobbuddi-applications

# Backups
gsutil mb -l us-central1 -c NEARLINE gs://jobbuddi-backups
gsutil uniformbucketlevelaccess set on gs://jobbuddi-backups

# Frontend static files
gsutil mb -l us-central1 -c STANDARD gs://jobbuddi-frontend
gsutil web set -m index.html -e 404.html gs://jobbuddi-frontend
```

### Step 4.2: Set Lifecycle Policies

```bash
# Backups - delete after 90 days
cat > backup-lifecycle.json << EOF
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "Delete"},
        "condition": {"age": 90}
      }
    ]
  }
}
EOF

gsutil lifecycle set backup-lifecycle.json gs://jobbuddi-backups
```

**✅ Checkpoint:** List buckets: `gsutil ls`

---

## ⚡ PHASE 5: REDIS (MEMORYSTORE) (Day 2)

### Step 5.1: Create Redis Instance

```bash
# Create Redis instance for caching
gcloud redis instances create jobbuddi-cache \
  --size=2 \
  --region=us-central1 \
  --redis-version=redis_7_0 \
  --tier=basic \
  --network=default

# Get Redis host and port
gcloud redis instances describe jobbuddi-cache \
  --region=us-central1 \
  --format="value(host,port)"
```

**✅ Checkpoint:** Verify Redis is running: `gcloud redis instances list`

---

*Next file will cover Cloud Run deployment...*
