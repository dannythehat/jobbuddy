# Manual Patch Instructions

## Files Already Applied ✅
- ✅ `backend/src/services/jobSummarizerService.ts` - Created
- ✅ `frontend/src/components/JobSummary.tsx` - Created
- ✅ `backend/migrations/add_job_snapshot.sql` - Created
- ✅ `backend/src/routes/jobsRoutes.ts` - Updated with summarize endpoint

## Files Needing Manual Patches

### 1. backend/src/models/Application.ts

**Location 1: Add to ApplicationAttributes interface (after line 48, after jobBoardId)**
```typescript
  // Job snapshot - preserves complete job data at apply-time
  jobSnapshot?: {
    title: string;
    company: string;
    location: string;
    salaryMin?: number;
    salaryMax?: number;
    description: string;
    requirements: string;
    jobType: string;
    remote: boolean;
    url?: string;
    postedDate?: Date;
    skillsRequired?: string[];
  };
```

**Location 2: Add to Application class (after line 98, after jobBoardId)**
```typescript
  // Job snapshot
  public jobSnapshot?: object;
```

**Location 3: Add to Application.init() (after line 195, before userId)**
```typescript
    // Job snapshot - preserves complete job data at apply-time
    jobSnapshot: {
      type: DataTypes.JSONB,
    },
```

### 2. backend/src/controllers/applicationController.ts

**Location 1: After line 237 (after `const job = await Job.findByPk(jobId);`)**

Add this code block:
```typescript
      // CREATE JOB SNAPSHOT - Preserve complete job data at apply-time
      const jobSnapshot = {
        title: job.title,
        company: job.company,
        location: job.location,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        description: job.description,
        requirements: job.requirements,
        jobType: job.jobType,
        remote: job.remote,
        url: job.url,
        postedDate: job.postedDate,
        skillsRequired: job.skillsRequired
      };
```

**Location 2: Update Application.create call (around line 280)**

Change from:
```typescript
      const application = await Application.create({
        userId,
        jobId,
        cvId,
        status: 'draft',
        notes,
        applicationMethod,
        referralSource,
        jobBoardUrl,
        jobBoardId,
        statusHistory,
        communications: [],
        followUpDates: []
      });
```

To:
```typescript
      const application = await Application.create({
        userId,
        jobId,
        cvId,
        status: 'draft',
        notes,
        applicationMethod,
        referralSource,
        jobBoardUrl,
        jobBoardId,
        jobSnapshot,  // ADD THIS LINE
        statusHistory,
        communications: [],
        followUpDates: []
      });
```

### 3. frontend/src/pages/ApplicationsPage.tsx

**Step 1: Import Chip component**
Add to existing Material-UI imports:
```typescript
import { Chip } from '@mui/material';
```

**Step 2: In application rendering logic**
Add before displaying job info:
```typescript
// Use snapshot if job was deleted
const displayJob = application.job || application.jobSnapshot;
```

**Step 3: Update job title display**
Replace job title section with:
```typescript
<Typography variant="h6">
  {displayJob?.title}
  {!application.job && application.jobSnapshot && (
    <Chip 
      label="Job Removed" 
      size="small" 
      color="warning" 
      sx={{ ml: 1 }}
    />
  )}
</Typography>
```

**Step 4: Update company/location display**
```typescript
<Typography color="text.secondary">
  {displayJob?.company} • {displayJob?.location}
</Typography>
```

**Step 5: Optional - Add info alert**
```typescript
{!application.job && application.jobSnapshot && (
  <Alert severity="info" sx={{ mt: 1 }}>
    This job posting is no longer available. Showing saved information from when you applied.
  </Alert>
)}
```

### 4. frontend/src/pages/JobsPage.tsx

**Step 1: Import JobSummary component**
```typescript
import JobSummary from '../components/JobSummary';
```

**Step 2: Add to job card rendering**
Inside your job card, add:
```typescript
{/* AI Summary */}
<JobSummary jobId={job.id} />
```

Example integration:
```typescript
<Card>
  <CardContent>
    <Typography variant="h6">{job.title}</Typography>
    <Typography color="text.secondary">
      {job.company} • {job.location}
    </Typography>
    
    {/* ADD AI SUMMARY HERE */}
    <JobSummary jobId={job.id} />
    
    <Typography variant="body2" sx={{ mt: 2 }}>
      {job.description}
    </Typography>
  </CardContent>
</Card>
```

## Environment Setup

Add to `backend/.env`:
```bash
OPENAI_API_KEY=your-openai-api-key-here
```

## Database Migration

Run the migration:
```bash
psql -d jobbuddy < backend/migrations/add_job_snapshot.sql
```

Or connect to your database and execute the SQL file.

## Testing

### Job Snapshot
1. Create an application
2. Check DB: `SELECT job_snapshot FROM applications ORDER BY created_at DESC LIMIT 1;`
3. Delete the job: `DELETE FROM jobs WHERE id = 'job-id';`
4. Reload applications page
5. Verify "Job Removed" chip appears

### Job Summarizer
1. Navigate to Jobs page
2. Click "AI Summary" button
3. Verify 3 bullet points appear
4. Check loading state works

## Summary

**Completed automatically:**
- Job Summarizer service ✅
- Job Summary component ✅
- Migration file ✅
- Routes updated ✅

**Needs manual patching:**
- Application.ts (3 locations)
- applicationController.ts (2 locations)
- ApplicationsPage.tsx (5 changes)
- JobsPage.tsx (2 changes)

**Estimated time:** 15-20 minutes for manual patches
