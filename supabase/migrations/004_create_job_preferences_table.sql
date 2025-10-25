-- Create job_preferences table
CREATE TABLE IF NOT EXISTS job_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_titles TEXT[],
  locations TEXT[],
  salary_min INTEGER,
  salary_max INTEGER,
  job_types TEXT[],
  remote_only BOOLEAN DEFAULT false,
  industries TEXT[],
  company_sizes TEXT[],
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_job_preferences_user_id ON job_preferences(user_id);
