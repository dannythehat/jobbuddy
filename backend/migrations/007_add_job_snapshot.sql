-- Phase: Job Snapshot at Apply-Time
-- Add job_snapshot column to applications table

-- Add job_snapshot column
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS job_snapshot JSONB;

-- Add index for querying
CREATE INDEX IF NOT EXISTS idx_applications_job_snapshot 
ON applications USING GIN (job_snapshot);

-- Add comment
COMMENT ON COLUMN applications.job_snapshot IS 'Snapshot of job data at time of application to preserve historical accuracy';
