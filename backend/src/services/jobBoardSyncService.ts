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

  /**
   * Sync jobs for all user connections
   */
  async syncJobsForUser(userId: string, searchParams?: JobBoardSearchParams): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      jobsFetched: 0,
      jobsStored: 0,
      duplicatesSkipped: 0,
      errors: []
    };

    try {
      // Get all active connections for user
      const connectionsQuery = `
        SELECT id, provider_id, access_token 
        FROM user_job_board_connections 
        WHERE user_id = $1 AND connection_status = 'active'
      `;
      const { rows: connections } = await pool.query(connectionsQuery, [userId]);

      // Sync each connection
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

  /**
   * Sync jobs from a specific provider connection
   */
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

      // Fetch jobs from provider
      const jobs = await client.fetchJobs(searchParams || {}, accessToken);
      result.jobsFetched = jobs.length;

      // Deduplicate jobs
      const uniqueJobs = await this.deduplicateJobs(jobs, providerId);
      result.duplicatesSkipped = jobs.length - uniqueJobs.length;

      // Store jobs in database
      result.jobsStored = await this.storeJobs(uniqueJobs, connectionId);

      // Update connection last_sync_at
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
