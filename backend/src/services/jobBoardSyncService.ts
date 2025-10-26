// Phase 7.1.1 Step 3: Job Board Sync Service
import { JobBoardJob, JobBoardSearchParams } from '../types/jobBoard';
import { LinkedInClient } from './jobBoard/LinkedInClient';
import pool from '../config/database';

interface SyncResult {
  success: boolean;
  jobsFetched: number;
  jobsStored: number;
  duplicatesSkipped: number;
  errors: string[];
}

export class JobBoardSyncService {
  private clients: Map<string, any>;

  constructor() {
    this.clients = new Map();
    this.clients.set('linkedin', new LinkedInClient());
  }

  async syncJobsForUser(userId: string, searchParams?: JobBoardSearchParams): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      jobsFetched: 0,
      jobsStored: 0,
      duplicatesSkipped: 0,
      errors: []
    };

    try {
      const connectionsQuery = `
        SELECT id, provider_id, access_token 
        FROM user_job_board_connections 
        WHERE user_id = $1 AND connection_status = 'active'
      `;
      const { rows: connections } = await pool.query(connectionsQuery, [userId]);

      for (const connection of connections) {
        try {
          const syncResult = await this.syncJobsFromProvider(
            connection.id,
            connection.provider_id,
            connection.access_token,
            searchParams
          );
          
          result.jobsFetched += syncResult.jobsFetched;
          result.jobsStored += syncResult.jobsStored;
          result.duplicatesSkipped += syncResult.duplicatesSkipped;
        } catch (error: any) {
          result.errors.push(`${connection.provider_id}: ${error.message}`);
        }
      }

      if (result.errors.length > 0) {
        result.success = false;
      }
    } catch (error: any) {
      result.success = false;
      result.errors.push(error.message);
    }

    return result;
  }

  async syncJobsFromProvider(
    connectionId: string,
    providerId: string,
    accessToken: string,
    searchParams?: JobBoardSearchParams
  ): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      jobsFetched: 0,
      jobsStored: 0,
      duplicatesSkipped: 0,
      errors: []
    };

    try {
      const client = this.clients.get(providerId);
      if (!client) {
        throw new Error(`No client found for provider: ${providerId}`);
      }

      const jobs = await client.fetchJobs(searchParams || {}, accessToken);
      result.jobsFetched = jobs.length;

      const uniqueJobs = await this.deduplicateJobs(jobs, providerId);
      result.duplicatesSkipped = jobs.length - uniqueJobs.length;

      result.jobsStored = await this.storeJobs(uniqueJobs, connectionId);

      await pool.query(
        'UPDATE user_job_board_connections SET last_sync_at = NOW() WHERE id = $1',
        [connectionId]
      );

    } catch (error: any) {
      result.success = false;
      result.errors.push(error.message);
    }

    return result;
  }

  async deduplicateJobs(jobs: JobBoardJob[], providerId: string): Promise<JobBoardJob[]> {
    const uniqueJobs: JobBoardJob[] = [];
    const seenIds = new Set<string>();

    for (const job of jobs) {
      const key = `${providerId}:${job.external_id}`;
      
      if (!seenIds.has(key)) {
        const existsQuery = `
          SELECT id FROM job_board_jobs 
          WHERE provider_id = $1 AND external_id = $2
        `;
        const { rows } = await pool.query(existsQuery, [providerId, job.external_id]);
        
        if (rows.length === 0) {
          uniqueJobs.push(job);
          seenIds.add(key);
        }
      }
    }

    return uniqueJobs;
  }

  async storeJobs(jobs: JobBoardJob[], connectionId: string): Promise<number> {
    let stored = 0;

    for (const job of jobs) {
      try {
        const insertQuery = `
          INSERT INTO job_board_jobs (
            external_id, provider_id, title, company, location, country_code,
            description, requirements, job_type, remote, salary_min, salary_max,
            salary_currency, url, posted_date, expires_date, is_premium_listing, raw_data
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
          RETURNING id
        `;
        
        await pool.query(insertQuery, [
          job.external_id,
          job.provider_id,
          job.title,
          job.company,
          job.location,
          job.country_code,
          job.description,
          job.requirements,
          job.job_type,
          job.remote,
          job.salary_min,
          job.salary_max,
          job.salary_currency,
          job.url,
          job.posted_date,
          job.expires_date,
          job.is_premium_listing,
          JSON.stringify(job.raw_data)
        ]);
        
        stored++;
      } catch (error: any) {
        console.error(`Failed to store job ${job.external_id}:`, error.message);
      }
    }

    return stored;
  }
}
