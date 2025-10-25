// Phase 7.1.2: Multi-Platform Search Service
import { jobFetchService } from './JobFetchService';
import { JobBoardSearchParams, JobBoardSearchResult, JobBoardJob } from '../../types/jobBoard';
import { pool } from '../../config/database';

export class MultiPlatformSearchService {
  /**
   * Search across all connected platforms
   */
  async searchAllPlatforms(
    userId: string,
    params: JobBoardSearchParams
  ): Promise<JobBoardSearchResult> {
    const startTime = Date.now();
    
    // Get user's active connections
    const connections = await this.getActiveConnections(userId);
    
    if (connections.length === 0) {
      return {
        jobs: [],
        total_count: 0,
        premium_count: 0,
        providers_used: [],
        search_duration_ms: Date.now() - startTime,
        has_more: false
      };
    }

    // Filter providers if specified
    let providersToSearch = connections.map(c => c.provider_name);
    if (params.providers && params.providers.length > 0) {
      providersToSearch = providersToSearch.filter(p => 
        params.providers!.includes(p)
      );
    }

    // Fetch from all providers in parallel
    const fetchPromises = providersToSearch.map(providerName =>
      jobFetchService.fetchFromProvider(userId, providerName, params)
        .catch(error => {
          console.error(`Error fetching from ${providerName}:`, error);
          return [];
        })
    );

    const results = await Promise.all(fetchPromises);
    
    // Flatten and deduplicate
    const allJobs = results.flat();
    const deduplicatedJobs = this.deduplicateJobs(allJobs);
    
    // Sort by relevance and premium status
    const sortedJobs = this.sortJobs(deduplicatedJobs, params);
    
    const premiumCount = sortedJobs.filter(j => j.is_premium_listing).length;
    
    // Save search history
    await this.saveSearchHistory(userId, params, sortedJobs.length, premiumCount, providersToSearch);
    
    return {
      jobs: sortedJobs,
      total_count: sortedJobs.length,
      premium_count: premiumCount,
      providers_used: providersToSearch,
      search_duration_ms: Date.now() - startTime,
      has_more: false
    };
  }

  /**
   * Search specific providers only
   */
  async searchProviders(
    userId: string,
    providerNames: string[],
    params: JobBoardSearchParams
  ): Promise<JobBoardSearchResult> {
    return this.searchAllPlatforms(userId, {
      ...params,
      providers: providerNames
    });
  }

  /**
   * Get user's active connections
   */
  private async getActiveConnections(userId: string) {
    const query = `
      SELECT p.name as provider_name, p.display_name
      FROM user_job_board_connections c
      JOIN job_board_providers p ON c.provider_id = p.id
      WHERE c.user_id = $1 AND c.connection_status = 'active'
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Deduplicate jobs by title and company
   */
  private deduplicateJobs(jobs: JobBoardJob[]): JobBoardJob[] {
    const seen = new Map<string, JobBoardJob>();
    
    for (const job of jobs) {
      const key = `${job.title.toLowerCase()}-${job.company.toLowerCase()}`;
      
      if (!seen.has(key)) {
        seen.set(key, job);
      } else {
        // Keep premium listing if duplicate
        const existing = seen.get(key)!;
        if (job.is_premium_listing && !existing.is_premium_listing) {
          seen.set(key, job);
        }
      }
    }
    
    return Array.from(seen.values());
  }

  /**
   * Sort jobs by relevance
   */
  private sortJobs(jobs: JobBoardJob[], params: JobBoardSearchParams): JobBoardJob[] {
    return jobs.sort((a, b) => {
      // Premium listings first
      if (a.is_premium_listing && !b.is_premium_listing) return -1;
      if (!a.is_premium_listing && b.is_premium_listing) return 1;
      
      // Then by posted date (newest first)
      if (a.posted_date && b.posted_date) {
        return b.posted_date.getTime() - a.posted_date.getTime();
      }
      
      return 0;
    });
  }

  /**
   * Save search history
   */
  private async saveSearchHistory(
    userId: string,
    params: JobBoardSearchParams,
    totalResults: number,
    premiumResults: number,
    providers: string[]
  ): Promise<void> {
    const query = `
      INSERT INTO job_search_history (
        user_id, search_query, filters, providers_searched,
        total_results, premium_results
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `;

    await pool.query(query, [
      userId,
      params.query || '',
      JSON.stringify(params),
      providers,
      totalResults,
      premiumResults
    ]);
  }

  /**
   * Get available providers for user
   */
  async getAvailableProviders(userId: string): Promise<string[]> {
    const connections = await this.getActiveConnections(userId);
    return connections.map(c => c.provider_name);
  }

  /**
   * Get all supported providers
   */
  getAllSupportedProviders(): string[] {
    return jobFetchService.getAvailableProviders();
  }
}

export const multiPlatformSearchService = new MultiPlatformSearchService();
