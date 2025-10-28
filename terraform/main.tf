# JobBuddy GCP Infrastructure with Terraform

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Cloud SQL PostgreSQL Instance
resource "google_sql_database_instance" "jobbuddy" {
  name             = "jobbuddy-db"
  database_version = "POSTGRES_14"
  region           = var.region
  
  settings {
    tier = var.db_tier
    
    backup_configuration {
      enabled            = true
      start_time         = "03:00"
      point_in_time_recovery_enabled = true
    }
    
    ip_configuration {
      ipv4_enabled = false
      require_ssl  = true
    }
    
    maintenance_window {
      day  = 7  # Sunday
      hour = 4
    }
  }
  
  deletion_protection = var.environment == "production"
}

# Database
resource "google_sql_database" "jobbuddy" {
  name     = "jobbuddy_prod"
  instance = google_sql_database_instance.jobbuddy.name
}

# Database User
resource "google_sql_user" "jobbuddy" {
  name     = "jobbuddy_user"
  instance = google_sql_database_instance.jobbuddy.name
  password = var.db_password
}

# Secret Manager Secrets
resource "google_secret_manager_secret" "db_password" {
  secret_id = "jobbuddy-db-password"
  
  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret" "jwt_secret" {
  secret_id = "jobbuddy-jwt-secret"
  
  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret" "openai_key" {
  secret_id = "jobbuddy-openai-key"
  
  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret" "encryption_key" {
  secret_id = "jobbuddy-encryption-key"
  
  replication {
    automatic = true
  }
}

# Cloud Storage Buckets
resource "google_storage_bucket" "cvs" {
  name          = "${var.project_id}-jobbuddy-cvs"
  location      = var.region
  force_destroy = var.environment != "production"
  
  uniform_bucket_level_access = true
  
  lifecycle_rule {
    condition {
      age = 365
    }
    action {
      type = "Delete"
    }
  }
}

resource "google_storage_bucket" "backups" {
  name          = "${var.project_id}-jobbuddy-backups"
  location      = var.region
  storage_class = "NEARLINE"
  force_destroy = var.environment != "production"
  
  uniform_bucket_level_access = true
  
  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type = "Delete"
    }
  }
}

# Service Account for Cloud Run
resource "google_service_account" "jobbuddy" {
  account_id   = "jobbuddy-runner"
  display_name = "JobBuddy Cloud Run Service Account"
}

# IAM Bindings for Secret Access
resource "google_secret_manager_secret_iam_member" "db_password_access" {
  secret_id = google_secret_manager_secret.db_password.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.jobbuddy.email}"
}

resource "google_secret_manager_secret_iam_member" "jwt_secret_access" {
  secret_id = google_secret_manager_secret.jwt_secret.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.jobbuddy.email}"
}

resource "google_secret_manager_secret_iam_member" "openai_key_access" {
  secret_id = google_secret_manager_secret.openai_key.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.jobbuddy.email}"
}

resource "google_secret_manager_secret_iam_member" "encryption_key_access" {
  secret_id = google_secret_manager_secret.encryption_key.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.jobbuddy.email}"
}

# Cloud SQL IAM for Service Account
resource "google_project_iam_member" "cloudsql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.jobbuddy.email}"
}
