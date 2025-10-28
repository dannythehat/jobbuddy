# Terraform Infrastructure for JobBuddy

This directory contains Terraform configuration for deploying JobBuddy infrastructure on Google Cloud Platform.

## Prerequisites

- Terraform >= 1.0
- GCP account with billing enabled
- `gcloud` CLI installed and authenticated

## Quick Start

### 1. Initialize Terraform

```bash
cd terraform
terraform init
```

### 2. Create terraform.tfvars

```bash
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with your values:

```hcl
project_id  = "your-gcp-project-id"
region      = "us-central1"
environment = "production"
db_tier     = "db-f1-micro"
db_password = "your-secure-password"
```

### 3. Plan Infrastructure

```bash
terraform plan
```

### 4. Apply Infrastructure

```bash
terraform apply
```

## What Gets Created

- **Cloud SQL PostgreSQL** - Managed database instance
- **Secret Manager Secrets** - Secure secret storage
- **Cloud Storage Buckets** - File storage (CVs, backups)
- **Service Account** - For Cloud Run services
- **IAM Bindings** - Proper access controls

## Outputs

After applying, Terraform will output:

- SQL instance connection name
- Service account email
- Storage bucket names

Use these values in your Cloud Run deployment.

## Cost Estimate

With default settings (db-f1-micro):
- Cloud SQL: ~$10-15/month
- Cloud Storage: ~$1-5/month
- Secret Manager: Free tier
- **Total: ~$15-20/month**

## Destroy Infrastructure

**Warning:** This will delete all resources!

```bash
terraform destroy
```

## Best Practices

1. **Use Remote State** - Store Terraform state in GCS
2. **Use Workspaces** - Separate dev/staging/prod
3. **Enable State Locking** - Prevent concurrent modifications
4. **Version Control** - Commit .tf files, not .tfvars

## Remote State Setup (Recommended)

Create a GCS bucket for Terraform state:

```bash
gsutil mb gs://your-project-terraform-state
gsutil versioning set on gs://your-project-terraform-state
```

Add to `main.tf`:

```hcl
terraform {
  backend "gcs" {
    bucket = "your-project-terraform-state"
    prefix = "jobbuddy/state"
  }
}
```

## Troubleshooting

### API Not Enabled

Enable required APIs:

```bash
gcloud services enable \
  sqladmin.googleapis.com \
  secretmanager.googleapis.com \
  storage.googleapis.com
```

### Permission Denied

Ensure your account has required roles:

```bash
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="user:YOUR_EMAIL" \
  --role="roles/editor"
```

## Next Steps

After Terraform creates infrastructure:

1. Store secrets in Secret Manager
2. Deploy application with Cloud Build
3. Configure custom domain
4. Set up monitoring
