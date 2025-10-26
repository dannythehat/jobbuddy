# Testing & Validation Checklist

**Part of:** GCP-MERGE.md
**Purpose:** Ensure everything works before going live

---

## GCP Infrastructure Tests

### Cloud SQL
- [ ] Can connect from local machine
- [ ] Can connect from Cloud Run
- [ ] All tables exist
- [ ] Data migrated correctly
- [ ] Backups configured
- [ ] Performance acceptable

### Redis
- [ ] Can connect from backend
- [ ] Caching works
- [ ] TTL configured correctly
- [ ] Memory usage acceptable

### Cloud Storage
- [ ] Can upload files
- [ ] Can download files
- [ ] Permissions correct
- [ ] Lifecycle policies active

### Secret Manager
- [ ] All secrets stored
- [ ] Backend can access secrets
- [ ] No secrets in code/env files

---

## Backend API Tests

### Job Boards
- [ ] GET /api/job-boards returns all boards
- [ ] GET /api/job-boards/country/:code filters correctly
- [ ] GET /api/job-boards/:id returns board details

### Connections
- [ ] POST /api/connections creates connection
- [ ] OAuth flow works end-to-end
- [ ] GET /api/connections returns user connections
- [ ] DELETE /api/connections/:id disconnects
- [ ] Token refresh works

### Job Scanning
- [ ] POST /api/scans/trigger starts scan
- [ ] Scan finds jobs from all connected boards
- [ ] Jobs are deduplicated
- [ ] Match scores calculated correctly
- [ ] GET /api/scans/history shows past scans

### Applications
- [ ] One-click apply works
- [ ] Cover letter generated correctly
- [ ] Application tracked in database
- [ ] Status updates from email work
- [ ] Timeline shows all events

---

## Frontend Tests

### Job Boards Page
- [ ] All boards display
- [ ] Country filter works
- [ ] Search works
- [ ] Connect button opens dialog
- [ ] OAuth flow completes
- [ ] Connected boards show status

### Jobs Page
- [ ] Jobs from all sources display
- [ ] Source badges show correctly
- [ ] Premium jobs flagged
- [ ] Save button works
- [ ] One-click apply works
- [ ] Filters work

### Saved Jobs Page
- [ ] All saved jobs display
- [ ] Can unsave jobs
- [ ] Can apply from saved
- [ ] Search and filter work

### Applications Page
- [ ] All applications display
- [ ] Timeline shows correctly
- [ ] Email responses display
- [ ] Status updates show
- [ ] Can add notes
- [ ] Can delete applications

### Dashboard
- [ ] Daily scan widget shows data
- [ ] Connection stats correct
- [ ] Application stats correct
- [ ] Charts render correctly

---

## Integration Tests

### Email Monitoring
- [ ] Emails scanned automatically
- [ ] Responses classified correctly
- [ ] Application status updates
- [ ] User notified of responses

### Calendar Integration
- [ ] Interview invites detected
- [ ] Calendar events created
- [ ] Conflicts detected
- [ ] Reminders work

### Daily Scanning
- [ ] Cron job runs daily
- [ ] All connected boards scanned
- [ ] New jobs found
- [ ] User notified
- [ ] Scan history recorded

---

## Performance Tests

### Load Testing
- [ ] 100 concurrent users
- [ ] 1000 jobs loaded quickly
- [ ] Search responds < 2s
- [ ] Apply completes < 5s

### Database
- [ ] Queries optimized
- [ ] Indexes created
- [ ] No N+1 queries
- [ ] Connection pooling works

### Caching
- [ ] Redis caching active
- [ ] Cache hit rate > 80%
- [ ] Stale data handled

---

## Security Tests

### Authentication
- [ ] JWT tokens secure
- [ ] Session management works
- [ ] Password hashing correct
- [ ] OAuth tokens encrypted

### Authorization
- [ ] Users can only see own data
- [ ] API endpoints protected
- [ ] File uploads validated
- [ ] SQL injection prevented

### Rate Limiting
- [ ] API rate limits enforced
- [ ] Brute force protection
- [ ] DDoS mitigation

---

## User Acceptance Tests

### New User Flow
- [ ] Can sign up
- [ ] Can upload CV
- [ ] CV parsed correctly
- [ ] Can set preferences
- [ ] Can connect job boards
- [ ] Can browse jobs
- [ ] Can apply to jobs

### Existing User Flow
- [ ] Data migrated correctly
- [ ] All applications visible
- [ ] Can connect new boards
- [ ] Daily scans work
- [ ] Notifications work

---

## Pre-Launch Checklist

- [ ] All tests passing
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] Security audit complete
- [ ] Backup/restore tested
- [ ] Monitoring configured
- [ ] Documentation updated
- [ ] Support team trained

---

**Ready to launch when all checkboxes are ticked!** ✅
