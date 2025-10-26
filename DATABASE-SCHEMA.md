# Database Schema Extensions

**Part of:** GCP-MERGE.md
**Purpose:** New tables for global job board integration

---

## New Tables Required

### 1. job_boards
Stores all available job boards globally.

### 2. user_job_board_connections  
Tracks which boards each user has connected.

### 3. job_sources
Links jobs to their source boards.

### 4. job_scan_history
Tracks daily scanning activity.

### 5. saved_jobs
User-saved jobs for later.

### 6. application_status_history
Complete timeline of application status changes.

---

Full SQL in next file...
