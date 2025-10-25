-- Phase 7.1: Job Board Subscriptions Schema

-- Table: job_board_providers
-- Stores available job board platforms
CREATE TABLE IF NOT EXISTS job_board_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  logo_url VARCHAR(500),
  website_url VARCHAR(500),
  is_premium BOOLEAN DEFAULT false,
  oauth_provider VARCHAR(50),
  api_base_url VARCHAR(500),
  rate_limit_per_hour INTEGER DEFAULT 100,
  supported_countries TEXT[],
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: user_job_board_connections
-- Stores user's connected job board accounts
CREATE TABLE IF NOT EXISTS user_job_board_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES job_board_providers(id) ON DELETE CASCADE,
  connection_status VARCHAR(50) DEFAULT 'active' CHECK (connection_status IN ('active', 'expired', 'revoked', 'error')),
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP,
  last_sync_at TIMESTAMP,
  sync_status VARCHAR(50) DEFAULT 'pending',
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, provider_id)
);

-- Table: job_board_jobs
-- Stores jobs fetched from connected job boards
CREATE TABLE IF NOT EXISTS job_board_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id VARCHAR(255) NOT NULL,
  provider_id UUID NOT NULL REFERENCES job_board_providers(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  country_code VARCHAR(2),
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency VARCHAR(3) DEFAULT 'USD',
  description TEXT,
  requirements TEXT,
  job_type VARCHAR(50),
  remote BOOLEAN DEFAULT false,
  url VARCHAR(500),
  posted_date TIMESTAMP,
  expires_date TIMESTAMP,
  is_premium_listing BOOLEAN DEFAULT false,
  application_count INTEGER,
  view_count INTEGER,
  raw_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(external_id, provider_id)
);

-- Table: job_search_history
-- Track searches across platforms
CREATE TABLE IF NOT EXISTS job_search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  search_query TEXT NOT NULL,
  filters JSONB,
  providers_searched TEXT[],
  total_results INTEGER DEFAULT 0,
  premium_results INTEGER DEFAULT 0,
  search_duration_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_job_board_providers_name ON job_board_providers(name);
CREATE INDEX idx_job_board_providers_is_premium ON job_board_providers(is_premium);
CREATE INDEX idx_user_connections_user_id ON user_job_board_connections(user_id);
CREATE INDEX idx_user_connections_provider_id ON user_job_board_connections(provider_id);
CREATE INDEX idx_user_connections_status ON user_job_board_connections(connection_status);
CREATE INDEX idx_job_board_jobs_provider_id ON job_board_jobs(provider_id);
CREATE INDEX idx_job_board_jobs_external_id ON job_board_jobs(external_id);
CREATE INDEX idx_job_board_jobs_company ON job_board_jobs(company);
CREATE INDEX idx_job_board_jobs_location ON job_board_jobs(location);
CREATE INDEX idx_job_board_jobs_country ON job_board_jobs(country_code);
CREATE INDEX idx_job_board_jobs_posted_date ON job_board_jobs(posted_date);
CREATE INDEX idx_job_board_jobs_is_premium ON job_board_jobs(is_premium_listing);
CREATE INDEX idx_job_search_history_user_id ON job_search_history(user_id);

-- Insert default job board providers
INSERT INTO job_board_providers (name, display_name, is_premium, oauth_provider, supported_countries, description) VALUES
('linkedin', 'LinkedIn', true, 'linkedin', ARRAY['US', 'CA', 'GB', 'DE', 'FR', 'IN', 'AU'], 'Professional networking and job search'),
('indeed', 'Indeed', true, 'indeed', ARRAY['US', 'CA', 'GB', 'DE', 'FR', 'IN', 'AU', 'JP'], 'World''s largest job site'),
('glassdoor', 'Glassdoor', true, 'glassdoor', ARRAY['US', 'CA', 'GB', 'DE', 'FR'], 'Jobs and company reviews'),
('ziprecruiter', 'ZipRecruiter', true, 'ziprecruiter', ARRAY['US', 'CA', 'GB'], 'AI-powered job matching'),
('monster', 'Monster', true, 'monster', ARRAY['US', 'CA', 'GB', 'DE', 'FR'], 'Global job search'),
('careerbuilder', 'CareerBuilder', true, 'careerbuilder', ARRAY['US', 'CA'], 'Career resources and jobs'),
('dice', 'Dice', true, 'dice', ARRAY['US', 'CA', 'GB'], 'Tech and IT jobs'),
('naukri', 'Naukri', true, 'naukri', ARRAY['IN'], 'India''s leading job portal'),
('seek', 'Seek', true, 'seek', ARRAY['AU', 'NZ'], 'Australia and New Zealand jobs'),
('reed', 'Reed', false, null, ARRAY['GB'], 'UK job search'),
('totaljobs', 'Totaljobs', false, null, ARRAY['GB'], 'UK job board'),
('stepstone', 'StepStone', true, 'stepstone', ARRAY['DE', 'FR', 'NL', 'BE'], 'European job search');
