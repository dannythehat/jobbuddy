output "sql_instance_connection_name" {
  description = "Cloud SQL instance connection name"
  value       = google_sql_database_instance.jobbuddy.connection_name
}

output "sql_instance_ip" {
  description = "Cloud SQL instance IP address"
  value       = google_sql_database_instance.jobbuddy.private_ip_address
}

output "service_account_email" {
  description = "Service account email for Cloud Run"
  value       = google_service_account.jobbuddy.email
}

output "cvs_bucket_name" {
  description = "CVs storage bucket name"
  value       = google_storage_bucket.cvs.name
}

output "backups_bucket_name" {
  description = "Backups storage bucket name"
  value       = google_storage_bucket.backups.name
}
