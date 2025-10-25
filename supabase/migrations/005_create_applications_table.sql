-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'interviewing', 'offered', 'accepted', 'rejected', 'withdrawn')),
  submission_date TIMESTAMP,
  cover_letter TEXT,
  notes TEXT,
  response_date TIMESTAMP,
  response_type VARCHAR(50) CHECK (response_type IN ('positive', 'negative', 'no_response')),
  application_method VARCHAR(50),
  referral_source VARCHAR(255),
  follow_up_dates TIMESTAMP[],
  rejection_reason VARCHAR(255),
  rejection_feedback TEXT,
  salary_offered INTEGER,
  negotiation_notes TEXT,
  status_history JSONB,
  communications JSONB,
  job_board_url VARCHAR(500),
  job_board_id VARCHAR(255),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  cv_id UUID NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_submission_date ON applications(submission_date);
