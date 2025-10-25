// Phase 7.1.1: Job Fetch Orchestration Service
import { pool } from '../../config/database';
import { LinkedInClient } from './LinkedInClient';
import { IndeedClient } from './IndeedClient';
import { GlassdoorClient } from './GlassdoorClient';
import { ZipRecruiterClient } from './ZipRecruiterClient';
import { MonsterClient } from './MonsterClient';
import { ReedClient } from './ReedClient';
import { SeekClient } from './SeekClient';
import { NaukriClient } from './NaukriClient';
import { DiceClient } from './DiceClient';
import { WellfoundClient } from './WellfoundClient';
import { JobBoardSearchParams, JobBoardJob } from '../../types/jobBoard';
import { jobBoardOAuthService } from '../jobBoardOAuthService';

export class JobFetchService {
  private clients: Map<string, any> = new Map();

  constructor() {
    // Original clients
    this.clients.set('linkedin', new LinkedInClient());
    this.clients.set('indeed', new IndeedClient());
    
    // New global clients
    this.clients.set('glassdoor', new GlassdoorClient());
    this.clients.set('ziprecruiter', new ZipRecruiterClient());
    this.clients.set('monster', new MonsterClient());
    
    // Regional clients
    this.clients.set('reed', new ReedClient()); // UK
    this.clients.set('seek', new SeekClient()); // Australia/NZ
    this.clients.set('naukri', new NaukriClient()); // India
    
    // Specialized clients
    this.clients.set('dice', new DiceClient()); // Tech
    this.clients.set('wellfound', new WellfoundClient()); // Startups
  }

  /**
   * Get all available provider names
   */
  getAvailableProviders(): string[] {
    return Array.from(this.clients.keys());
  }

  /**
   * Check if a provider is supported
   */
  isProviderSupported(providerName: string): boolean {
    return this.clients.has(providerName);
  }

  /**
   * Fetch jobs from a specific provider
   */
  async fetchFromProvider(
    userId: string,
    providerName: string,
    params: JobBoardSearchParams
  ): Promise<JobBoardJob[]> {
    const client = this.clients.get(providerName);
    if (!client) {
      throw new Error(`No client found for provider: ${providerName}`);
    }

    // Get user's connection for this provider
    const connection = await this.getUserConnection(userId, providerName);
    if (!connection) {
      throw new Error(`No active connection for provider: ${providerName}`);
    }

    // Decrypt access token
    const accessToken = jobBoardOAuthService.decryptToken(connection.access_token);

    // Fetch jobs
    const jobs = await client.fetchJobs(params, accessToken);

    // Store jobs in database
    await this.storeJobs(jobs, connection.provider_id);

    return jobs;
  }

  /**
   * Fetch jobs from multiple providers in parallel
   */
  async fetchFromMultipleProviders(
    userId: string,
    providerNames: string[],
    params: JobBoardSearchParams
  ): Promise<Map<string, JobBoardJob[]>> {
    const results = new Map<string, JobBoardJob[]>();

    await Promise.allSettled(
      providerNames.map(async (providerName) => {
        try {
          const jobs = await this.fetchFromProvider(userId, providerName, params);
          results.set(providerName, jobs);
        } catch (error) {
          console.error(`Failed to fetch from ${providerName}:`, error);
          results.set(providerName, []);
        }
      })
    );

    return results;
  }

  /**
   * Get user's connection for a provider
   */
  private async getUserConnection(userId: string, providerName: string) {
    const query = `
      SELECT c.*, p.id as provider_id
      FROM user_job_board_connections c
      JOIN job_board_providers p ON c.provider_id = p.id
      WHERE c.user_id = $1 
        AND p.name = $2 
        AND c.connection_status = 'active'
    `;
    
    const result = await pool.query(query, [userId, providerName]);
    return result.rows[0] || null;
  }

  /**
   * Store jobs in database
   */
  private async storeJobs(jobs: JobBoardJob[], providerId: string): Promise<void> {
    for (const job of jobs) {
      const query = `
        INSERT INTO job_board_jobs (
          external_id, provider_id, title, company, location, 
          country_code, salary_min, salary_max, salary_currency,
          description, requirements, job_type, remote, url,
          posted_date, is_premium_listing, raw_data
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        ON CONFLICT (external_id, provider_id) 
        DO UPDATE SET
          title = $3,
          company = $4,
          location = $5,
          updated_at = NOW()
      `;

      await pool.query(query, [
        job.external_id,
        providerId,
        job.title,
        job.company,
        job.location,
        job.country_code,
        job.salary_min,
        job.salary_max,
        job.salary_currency,
        job.description,
        job.requirements,
        job.job_type,
        job.remote,
        job.url,
        job.posted_date,
        job.is_premium_listing,
        JSON.stringify(job.raw_data)
      ]);
    }
  }
}

export const jobFetchService = new JobFetchService();
