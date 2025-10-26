# Backend Code Structure

**Part of:** GCP-MERGE.md  
**Purpose:** New backend services and controllers needed

---

## New Services to Create

### 1. JobBoardService
**Location:** `backend/src/services/JobBoardService.ts`

**Methods:**
- `registerJobBoard()` - Add new board to registry
- `getAvailableBoards()` - List all boards by country
- `getBoardById()` - Get specific board details
- `searchBoards()` - Search boards by name/country

### 2. ConnectionService  
**Location:** `backend/src/services/ConnectionService.ts`

**Methods:**
- `connectBoard()` - Connect user to job board
- `disconnectBoard()` - Remove connection
- `getUserConnections()` - Get all user connections
- `refreshOAuthToken()` - Refresh expired tokens
- `testConnection()` - Verify connection works

### 3. JobScanService
**Location:** `backend/src/services/JobScanService.ts`

**Methods:**
- `performDailyScan()` - Scan all boards for user
- `scanSingleBoard()` - Scan specific board
- `scheduleScans()` - Setup cron jobs
- `getS canHistory()` - View past scans

### 4. JobAggregationService
**Location:** `backend/src/services/JobAggregationService.ts`

**Methods:**
- `aggregateJobs()` - Combine jobs from all sources
- `deduplicateJobs()` - Remove duplicates
- `scoreJobs()` - Apply matching algorithm
- `filterJobs()` - Apply user preferences

### 5. ApplicationAutomationService
**Location:** `backend/src/services/ApplicationAutomationService.ts`

**Methods:**
- `autoApply()` - Submit application automatically
- `generateCoverLetter()` - AI cover letter (already exists, enhance)
- `fillApplicationForm()` - Auto-fill job application
- `trackSubmission()` - Record application

---

## New Controllers to Create

### 1. JobBoardController
**Location:** `backend/src/controllers/JobBoardController.ts`

**Endpoints:**
- GET `/api/job-boards` - List all boards
- GET `/api/job-boards/:id` - Get board details
- GET `/api/job-boards/country/:code` - Boards by country

### 2. ConnectionController
**Location:** `backend/src/controllers/ConnectionController.ts`

**Endpoints:**
- POST `/api/connections` - Connect to board
- GET `/api/connections` - Get user connections
- DELETE `/api/connections/:id` - Disconnect
- GET `/api/connections/:id/status` - Check status
- POST `/api/connections/:id/refresh` - Refresh token

### 3. JobScanController
**Location:** `backend/src/controllers/JobScanController.ts`

**Endpoints:**
- POST `/api/scans/trigger` - Manual scan
- GET `/api/scans/history` - Scan history
- GET `/api/scans/latest` - Latest scan results
- PUT `/api/scans/preferences` - Update scan settings

---

## Existing Services to Enhance

### ApplicationService (already exists)
**Add methods:**
- `updateStatusFromEmail()` - Auto-update from email
- `getApplicationTimeline()` - Full history
- `bulkApply()` - Apply to multiple jobs

### ResponseService (already exists)  
**Add methods:**
- `mapResponseToStatus()` - Better status mapping
- `extractActionItems()` - Parse next steps
- `generateAutoReply()` - Smart email replies

---

Next file will have API endpoint details...
