# Completion Guide - Job Snapshot & Job Summarizer

## Step 1: Update Application Model (15 min)

**File**: `backend/src/models/Application.ts`

### Add to ApplicationAttributes interface (after line 48):
```typescript
// Job snapshot - preserves job data at apply-time
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

### Add to Application class (after line 98):
```typescript
// Job snapshot
public jobSnapshot?: object;
```

### Add to Application.init() (after line 195, before userId):
```typescript
// Job snapshot - preserves complete job data
jobSnapshot: {
  type: DataTypes.JSONB,
},
```

---

## Step 2: Update Application Creation (20 min)

**File**: `backend/src/controllers/applicationController.ts` or wherever applications are created

### Add job snapshot capture:
```typescript
import { Job } from '../models/Job';

// When creating application:
async createApplication(req, res) {
  try {
    const { jobId, ...applicationData } = req.body;
    
    // Fetch complete job data
    const job = await Job.findByPk(jobId);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    // Create job snapshot
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
    
    // Create application with snapshot
    const application = await Application.create({
      ...applicationData,
      jobId,
      jobSnapshot,
      userId: req.user.id
    });
    
    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

---

## Step 3: Update Frontend Display (10 min)

**File**: `frontend/src/pages/ApplicationsPage.tsx`

### Import Chip component:
```typescript
import { Chip } from '@mui/material';
```

### Update job display logic:
```typescript
// In the application card/list rendering:
const displayJob = application.job || application.jobSnapshot;

// Add warning chip if job was deleted:
{!application.job && application.jobSnapshot && (
  <Chip 
    label="Job Removed" 
    size="small" 
    color="warning" 
    sx={{ ml: 1 }}
  />
)}

// Display job details from snapshot:
<Typography variant="h6">
  {displayJob?.title}
  {!application.job && application.jobSnapshot && (
    <Chip label="Job Removed" size="small" color="warning" sx={{ ml: 1 }} />
  )}
</Typography>
<Typography color="text.secondary">
  {displayJob?.company} • {displayJob?.location}
</Typography>
```

---

## Step 4: Replace Routes File (2 min)

**In terminal**:
```bash
cd backend/src/routes
mv jobsRoutes.ts jobsRoutes-old.ts
mv jobsRoutes-updated.ts jobsRoutes.ts
```

---

## Step 5: Integrate Job Summarizer in JobsPage (5 min)

**File**: `frontend/src/pages/JobsPage.tsx`

### Import component:
```typescript
import JobSummary from '../components/JobSummary';
```

### Add to job card (where job details are displayed):
```typescript
<Card>
  <CardContent>
    <Typography variant="h6">{job.title}</Typography>
    <Typography color="text.secondary">{job.company}</Typography>
    
    {/* Add AI Summary */}
    <JobSummary jobId={job.id} />
    
    <Typography variant="body2">{job.description}</Typography>
  </CardContent>
</Card>
```

---

## Step 6: Environment Setup (1 min)

**File**: `backend/.env`

Add:
```
OPENAI_API_KEY=your-openai-api-key-here
```

**File**: `backend/.env.example`

Add:
```
# OpenAI API Key for AI features (job summarizer, etc.)
OPENAI_API_KEY=sk-...
```

---

## Step 7: Run Migration (2 min)

```bash
# Connect to your database
psql -d jobbuddy -U your_username

# Run the migration
\i backend/migrations/add_job_snapshot.sql

# Verify
\d applications
# Should see job_snapshot column
```

---

## Step 8: Testing (15 min)

### Test Job Snapshot:
1. Create a new application
2. Check database: `SELECT id, job_snapshot FROM applications ORDER BY created_at DESC LIMIT 1;`
3. Verify job_snapshot is populated
4. Delete the job: `DELETE FROM jobs WHERE id = 'job-id';`
5. Reload applications page
6. Verify job still displays with "Job Removed" chip

### Test Job Summarizer:
1. Navigate to Jobs page
2. Find a job with description
3. Click "AI Summary" button
4. Verify loading state appears
5. Verify 3 bullet points appear
6. Test with invalid API key (should show error)

---

## Verification Checklist

- [ ] Application model has jobSnapshot field
- [ ] Application creation captures job snapshot
- [ ] Frontend displays snapshot when job deleted
- [ ] "Job Removed" chip appears correctly
- [ ] Routes file replaced
- [ ] JobSummary component imported in JobsPage
- [ ] OPENAI_API_KEY set in environment
- [ ] Migration ran successfully
- [ ] Job snapshot tested (create, delete, display)
- [ ] Job summarizer tested (button, loading, results)

---

## Commit & Push

```bash
git add .
git commit -m "Complete Job Snapshot & Job Summarizer implementation"
git push origin feature/job-snapshot-summarizer
```

---

## Update PR

Comment on PR #13:
"✅ Implementation complete! All features tested and working."

---

**Total Time**: ~1 hour (faster than estimated!)

🚀 **Ready to merge!**
