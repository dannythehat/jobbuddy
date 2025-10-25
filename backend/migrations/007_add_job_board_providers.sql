-- Phase 7.1: Add Job Board Providers
-- Migration: 007_add_job_board_providers.sql

-- Insert all supported job board providers
INSERT INTO job_board_providers (
  id, name, display_name, logo_url, website_url, is_premium,
  oauth_provider, api_base_url, rate_limit_per_hour,
  supported_countries, description, is_active
) VALUES
  -- LinkedIn
  (
    'linkedin',
    'linkedin',
    'LinkedIn',
    'https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Logo.svg.original.svg',
    'https://www.linkedin.com',
    true,
    'linkedin',
    'https://api.linkedin.com/v2',
    100,
    ARRAY['US', 'UK', 'CA', 'AU', 'IN', 'DE', 'FR', 'SG', 'JP', 'BR'],
    'Professional networking platform with extensive job listings and company insights',
    true
  ),
  
  -- Indeed
  (
    'indeed',
    'indeed',
    'Indeed',
    'https://www.indeed.com/images/indeed-logo.svg',
    'https://www.indeed.com',
    false,
    'indeed',
    'https://apis.indeed.com/v1',
    100,
    ARRAY['US', 'UK', 'CA', 'AU', 'IN', 'DE', 'FR', 'JP', 'BR', 'MX'],
    'World''s largest job site with millions of listings across all industries',
    true
  ),
  
  -- Glassdoor
  (
    'glassdoor',
    'glassdoor',
    'Glassdoor',
    'https://www.glassdoor.com/static/img/api/glassdoor_logo_80x40.png',
    'https://www.glassdoor.com',
    true,
    'glassdoor',
    'https://api.glassdoor.com/api/v1',
    1000,
    ARRAY['US', 'UK', 'CA', 'AU', 'IN', 'DE', 'FR'],
    'Job search with company reviews, salary information, and interview insights',
    true
  ),
  
  -- ZipRecruiter
  (
    'ziprecruiter',
    'ziprecruiter',
    'ZipRecruiter',
    'https://www.ziprecruiter.com/img/logos/logo-sm-black.svg',
    'https://www.ziprecruiter.com',
    true,
    'ziprecruiter',
    'https://api.ziprecruiter.com/v2',
    500,
    ARRAY['US', 'UK', 'CA'],
    'AI-powered job matching with high-volume listings and one-click apply',
    true
  ),
  
  -- Monster
  (
    'monster',
    'monster',
    'Monster',
    'https://www.monster.com/logos/monster-logo.svg',
    'https://www.monster.com',
    false,
    'monster',
    'https://api.monster.com/v1',
    200,
    ARRAY['US', 'UK', 'CA', 'AU', 'IN', 'DE', 'FR', 'NL', 'BE'],
    'Established job board with global reach and career resources',
    true
  ),
  
  -- Reed (UK)
  (
    'reed',
    'reed',
    'Reed.co.uk',
    'https://www.reed.co.uk/static/img/reed-logo.svg',
    'https://www.reed.co.uk',
    false,
    'reed',
    'https://www.reed.co.uk/api/1.0',
    200,
    ARRAY['UK'],
    'Leading UK job board with extensive local listings and recruitment services',
    true
  ),
  
  -- Seek (Australia/NZ)
  (
    'seek',
    'seek',
    'SEEK',
    'https://www.seek.com.au/static/img/seek-logo.svg',
    'https://www.seek.com.au',
    true,
    'seek',
    'https://api.seek.com/v4',
    300,
    ARRAY['AU', 'NZ', 'HK', 'SG', 'TH', 'MY', 'PH', 'ID'],
    'Leading job board in Australia and Asia-Pacific region',
    true
  ),
  
  -- Naukri (India)
  (
    'naukri',
    'naukri',
    'Naukri.com',
    'https://static.naukimg.com/s/0/0/i/new-homepage/naukri-logo.svg',
    'https://www.naukri.com',
    false,
    'naukri',
    'https://api.naukri.com/v3',
    250,
    ARRAY['IN'],
    'India''s largest job portal with millions of opportunities across all sectors',
    true
  ),
  
  -- Dice (Tech)
  (
    'dice',
    'dice',
    'Dice',
    'https://www.dice.com/static/img/dice-logo.svg',
    'https://www.dice.com',
    false,
    'dice',
    'https://api.dice.com/v1',
    150,
    ARRAY['US', 'UK'],
    'Premier tech job board for IT professionals with skills tracking and certifications',
    true
  ),
  
  -- Wellfound (AngelList)
  (
    'wellfound',
    'wellfound',
    'Wellfound (AngelList)',
    'https://wellfound.com/images/wellfound-logo.svg',
    'https://wellfound.com',
    true,
    'wellfound',
    'https://api.wellfound.com/v1',
    100,
    ARRAY['US', 'UK', 'CA', 'DE', 'FR', 'SG', 'IN'],
    'Startup and tech jobs with equity information and direct access to founders',
    true
  )
ON CONFLICT (id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  logo_url = EXCLUDED.logo_url,
  website_url = EXCLUDED.website_url,
  api_base_url = EXCLUDED.api_base_url,
  rate_limit_per_hour = EXCLUDED.rate_limit_per_hour,
  supported_countries = EXCLUDED.supported_countries,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_job_board_providers_active 
  ON job_board_providers(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_job_board_providers_premium 
  ON job_board_providers(is_premium) WHERE is_premium = true;

-- Add GIN index for supported_countries array searches
CREATE INDEX IF NOT EXISTS idx_job_board_providers_countries 
  ON job_board_providers USING GIN(supported_countries);

COMMENT ON TABLE job_board_providers IS 'Supported job board platforms with OAuth and API configuration';
COMMENT ON COLUMN job_board_providers.rate_limit_per_hour IS 'API rate limit per hour for this provider';
COMMENT ON COLUMN job_board_providers.supported_countries IS 'Array of ISO country codes where this provider operates';
