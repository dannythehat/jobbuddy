// Phase 7.1.1: Indeed Job Board Client
import { BaseJobBoardClient } from './BaseJobBoardClient';
import { JobBoardJob, JobBoardSearchParams } from '../../types/jobBoard';

export class IndeedClient extends BaseJobBoardClient {
  constructor() {
    super('https://apis.indeed.com/v1', 'Indeed');
  }

  async fetchJobs(params: JobBoardSearchParams, accessToken: string): Promise<JobBoardJob[]> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.query) {
        searchParams.append('q', params.query);
      }
      
      if (params.location) {
        searchParams.append('l', params.location);
      }
      
      if (params.country) {
        searchParams.append('co', params.country);
      }
      
      if (params.remote) {
        searchParams.append('jt', 'remote');
      }
      
      if (params.job_type) {
        searchParams.append('jt', params.job_type);
      }
      
      if (params.salary_min) {
        searchParams.append('salary', params.salary_min.toString());
      }
      
      // Limit results
      searchParams.append('limit', '25');
      
      const endpoint = `/jobs/search?${searchParams.toString()}`;
      const response = await this.makeRequest<any>(endpoint, accessToken);
      
      const jobs = response.results || [];
      return jobs.map((job: any) => this.normalizeIndeedJob(job));
    } catch (error) {
      console.error('Indeed job fetch error:', error);
      throw error;
    }
  }

  async getJobDetails(jobId: string, accessToken: string): Promise<JobBoardJob | null> {
    try {
      const endpoint = `/jobs/${jobId}`;
      const job = await this.makeRequest<any>(endpoint, accessToken);
      
      return this.normalizeIndeedJob(job);
    } catch (error) {
      console.error('Indeed job details error:', error);
      return null;
    }
  }

  async validateToken(accessToken: string): Promise<boolean> {
    try {
      await this.makeRequest<any>('/auth/verify', accessToken);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getRateLimitInfo(accessToken: string): Promise<{
    remaining: number;
    reset: Date;
    limit: number;
  }> {
    // Indeed rate limits: typically 100 requests per hour
    return {
      remaining: 100,
      reset: new Date(Date.now() + 3600000),
      limit: 100
    };
  }

  /**
   * Normalize Indeed job to common format
   */
  private normalizeIndeedJob(job: any): JobBoardJob {
    const salary = this.extractIndeedSalary(job);

    return {
      id: job.jobkey || job.id,
      external_id: job.jobkey || job.id,
      provider_id: 'indeed',
      title: job.jobtitle || job.title || '',
      company: job.company || '',
      location: job.formattedLocation || job.location,
      country_code: job.country,
      description: job.snippet || job.description,
      requirements: job.requirements,
      job_type: this.normalizeJobType(job.jobtype),
      remote: job.remote || false,
      url: job.url || `https://www.indeed.com/viewjob?jk=${job.jobkey}`,
      posted_date: job.date ? new Date(job.date) : undefined,
      is_premium_listing: job.sponsored || false,
      salary_min: salary.min,
      salary_max: salary.max,
      salary_currency: salary.currency || 'USD',
      raw_data: job,
      created_at: new Date(),
      updated_at: new Date()
    } as JobBoardJob;
  }

  /**
   * Extract salary from Indeed format
   */
  private extractIndeedSalary(job: any): {
    min?: number;
    max?: number;
    currency?: string;
  } {
    if (!job.salary) return {};

    // Indeed provides salary in various formats
    if (typeof job.salary === 'object') {
      return {
        min: job.salary.min,
        max: job.salary.max,
        currency: job.salary.currency
      };
    }

    // Parse salary string
    const salaryStr = job.salary.toString();
    const match = salaryStr.match(/\$?([\d,]+)\s*-\s*\$?([\d,]+)/);
    
    if (match) {
      return {
        min: parseInt(match[1].replace(/,/g, '')),
        max: parseInt(match[2].replace(/,/g, '')),
        currency: 'USD'
      };
    }

    return {};
  }

  /**
   * Normalize job type
   */
  private normalizeJobType(indeedType?: string): string {
    if (!indeedType) return 'full-time';
    
    const typeMap: Record<string, string> = {
      'fulltime': 'full-time',
      'parttime': 'part-time',
      'contract': 'contract',
      'temporary': 'temporary',
      'internship': 'internship'
    };
    
    return typeMap[indeedType.toLowerCase()] || 'full-time';
  }
}
