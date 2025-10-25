// Phase 7.1: Job Board Integration Types

export interface JobBoardProvider {
  id: string;
  name: string;
  display_name: string;
  logo_url?: string;
  website_url?: string;
  is_premium: boolean;
  oauth_provider?: string;
  api_base_url?: string;
  rate_limit_per_hour: number;
  supported_countries: string[];
  description?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserJobBoardConnection {
  id: string;
  user_id: string;
  provider_id: string;
  connection_status: 'active' | 'expired' | 'revoked' | 'error';
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: Date;
  last_sync_at?: Date;
  sync_status: string;
  error_message?: string;
  metadata?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
  provider?: JobBoardProvider;
}

export interface JobBoardJob {
  id: string;
  external_id: string;
  provider_id: string;
  title: string;
  company: string;
  location?: string;
  country_code?: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  description?: string;
  requirements?: string;
  job_type?: string;
  remote: boolean;
  url?: string;
  posted_date?: Date;
  expires_date?: Date;
  is_premium_listing: boolean;
  application_count?: number;
  view_count?: number;
  raw_data?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
  provider?: JobBoardProvider;
}

export interface JobSearchHistory {
  id: string;
  user_id: string;
  search_query: string;
  filters?: Record<string, any>;
  providers_searched: string[];
  total_results: number;
  premium_results: number;
  search_duration_ms?: number;
  created_at: Date;
}

export interface OAuthConfig {
  provider: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  authorization_url: string;
  token_url: string;
  scopes: string[];
}

export interface JobBoardSearchParams {
  query?: string;
  location?: string;
  country?: string;
  remote?: boolean;
  job_type?: string;
  salary_min?: number;
  salary_max?: number;
  posted_within_days?: number;
  include_premium?: boolean;
  providers?: string[];
}

export interface JobBoardSearchResult {
  jobs: JobBoardJob[];
  total_count: number;
  premium_count: number;
  providers_used: string[];
  search_duration_ms: number;
  has_more: boolean;
}

export interface ConnectionHealth {
  provider_id: string;
  provider_name: string;
  is_connected: boolean;
  status: 'active' | 'expired' | 'revoked' | 'error';
  last_sync: Date | null;
  error_message?: string;
  requires_reauth: boolean;
}
