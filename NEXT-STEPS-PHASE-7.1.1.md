# Phase 7.1.1 - Job Fetching Implementation

## 🎯 Goal
Fetch jobs from connected job boards

---

## Step 1: Implement Base Job Client (45 min)

**File**: `backend/src/services/jobBoard/BaseJobBoardClient.ts` (already exists)

**Review and enhance**:
- Rate limiting
- Error handling
- Retry logic

---

## Step 2: Implement LinkedIn Client (1 hour)

**File**: `backend/src/services/jobBoard/LinkedInClient.ts` (already exists)

**Add methods**:
- `fetchJobs(params)` - Get job listings
- `getJobDetails(jobId)` - Get single job
- `searchJobs(query)` - Search with filters

---

## Step 3: Create Job Sync Service (1 hour)

**New File**: `backend/src/services/jobBoardSyncService.ts`

**Functions**:
- `syncJobsForUser(userId)` - Sync all connections
- `syncJobsFromProvider(connectionId)` - Sync one provider
- `deduplicateJobs(jobs)` - Remove duplicates
- `storeJobs(jobs)` - Save to database

---

## Step 4: Add Sync Endpoint (30 min)

**File**: `backend/src/routes/jobBoardRoutes.ts`

Add route:
```typescript
router.post('/sync/:connectionId', async (req, res) => {
  // Trigger job sync for connection
});
```

---

## Step 5: Test Job Fetching (30 min)

1. Connect LinkedIn account
2. Trigger sync
3. Verify jobs in database
4. Check deduplication

---

Total Time: ~3.5 hours