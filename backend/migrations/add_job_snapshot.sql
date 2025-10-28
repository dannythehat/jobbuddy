-- Add job_snapshot column to applications table
-- This preserves complete job data when user applies, preventing data loss if job is deleted/modified

ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS job_snapshot JSONB;

-- Add index for querying job snapshots
CREATE INDEX IF NOT EXISTS idx_applications_job_snapshot 
ON applications USING GIN (job_snapshot);

-- Add comment for documentation
COMMENT ON COLUMN applications.job_snapshot IS 'Complete job data snapshot at time of application to preserve historical accuracy';

-- Backfill existing applications (optional - only if jobs still exist)
-- This will populate snapshots for existing applications where the job still exists
UPDATE applications a
SET job_snapshot = (
  SELECT jsonb_build_object(
    'title', j.title,
    'company', j.company,
    'location', j.location,
    'salary_min', j.salary_min,
    'salary_max', j.salary_max,
    'description', j.description,
    'requirements', j.requirements,
    'job_type', j.job_type,
    'remote', j.remote,
    'url', j.url,
    'posted_date', j.posted_date,
    'skills_required', j.skills_required
  )
  FROM jobs j
  WHERE j.id = a.job_id
)
WHERE a.job_snapshot IS NULL
  AND EXISTS (SELECT 1 FROM jobs j WHERE j.id = a.job_id);
