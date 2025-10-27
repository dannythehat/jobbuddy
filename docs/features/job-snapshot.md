# Feature: Job Snapshot at Apply-Time

## Overview
Store complete job data when user applies, preventing data loss if job is deleted/modified.

## Time Estimate: 1.5 hours

## Implementation Steps

### Step 1: Database Migration (20 min)
**File**: `backend/migrations/add_job_snapshot.sql`

```sql
-- Add job_snapshot column to applications table
ALTER TABLE applications 
ADD COLUMN job_snapshot JSONB;

-- Add index for querying
CREATE INDEX idx_applications_job_snapshot 
ON applications USING GIN (job_snapshot);

-- Backfill existing applications (optional)
UPDATE applications a
SET job_snapshot = (
  SELECT row_to_json(j)
  FROM jobs j
  WHERE j.id = a.job_id
)
WHERE job_snapshot IS NULL;
```

### Step 2: Update Application Model (15 min)
**File**: `backend/src/models/application.ts`

Add to interface:
```typescript
interface Application {
  // ... existing fields
  job_snapshot?: {
    title: string;
    company: string;
    location: string;
    salary_min?: number;
    salary_max?: number;
    description: string;
    requirements: string;
    job_type: string;
    remote: boolean;
    url?: string;
    posted_date?: Date;
  };
}
```

### Step 3: Update Application Creation (30 min)
**File**: `backend/src/services/applicationService.ts`

```typescript
async createApplication(userId: string, jobId: string, data: any) {
  // Fetch full job data
  const job = await pool.query(
    'SELECT * FROM jobs WHERE id = $1',
    [jobId]
  );
  
  if (!job.rows[0]) {
    throw new Error('Job not found');
  }
  
  // Create snapshot
  const jobSnapshot = {
    title: job.rows[0].title,
    company: job.rows[0].company,
    location: job.rows[0].location,
    salary_min: job.rows[0].salary_min,
    salary_max: job.rows[0].salary_max,
    description: job.rows[0].description,
    requirements: job.rows[0].requirements,
    job_type: job.rows[0].job_type,
    remote: job.rows[0].remote,
    url: job.rows[0].url,
    posted_date: job.rows[0].posted_date
  };
  
  // Insert application with snapshot
  const result = await pool.query(
    `INSERT INTO applications 
     (user_id, job_id, status, job_snapshot, ...) 
     VALUES ($1, $2, $3, $4, ...) 
     RETURNING *`,
    [userId, jobId, 'pending', JSON.stringify(jobSnapshot), ...]
  );
  
  return result.rows[0];
}
```

### Step 4: Update Application Display (25 min)
**File**: `frontend/src/pages/ApplicationsPage.tsx`

```typescript
// Fallback to snapshot if job deleted
const displayJob = application.job || application.job_snapshot;

<Card>
  <CardContent>
    <Typography variant="h6">
      {displayJob.title}
      {!application.job && (
        <Chip label="Job Removed" size="small" color="warning" />
      )}
    </Typography>
    <Typography color="text.secondary">
      {displayJob.company} • {displayJob.location}
    </Typography>
  </CardContent>
</Card>
```

## Testing

### Test 1: Create Application
```bash
curl -X POST http://localhost:3001/api/applications \
  -H "Authorization: Bearer TOKEN" \
  -d '{"job_id": "123", "cover_letter": "..."}'
```

Verify `job_snapshot` is populated in database.

### Test 2: Delete Job
```sql
DELETE FROM jobs WHERE id = '123';
```

Verify application still displays correctly using snapshot.

### Test 3: Frontend Display
- Navigate to Applications page
- Check deleted job shows "Job Removed" chip
- Verify all job details still visible

## Benefits
- ✅ Never lose job data
- ✅ Historical accuracy
- ✅ Better analytics
- ✅ Audit trail

## Files to Create
- `backend/migrations/add_job_snapshot.sql`

## Files to Modify
- `backend/src/models/application.ts`
- `backend/src/services/applicationService.ts`
- `frontend/src/pages/ApplicationsPage.tsx`

Ready to implement?
