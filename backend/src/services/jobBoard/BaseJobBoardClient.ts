// Phase 7.1.1: Base Job Board API Client
import { JobBoardJob, JobBoardSearchParams } from '../../types/jobBoard';

export interface JobBoardAPIClient {
  /**
   * Fetch jobs from the job board
   */
  fetchJobs(params: JobBoardSearchParams, accessToken: string): Promise<JobBoardJob[]>;

  /**
   * Get job details by ID
   */
  getJobDetails(jobId: string, accessToken: string): Promise<JobBoardJob | null>;

  /**
   * Validate access token
   */
  validateToken(accessToken: string): Promise<boolean>;

  /**
   * Get rate limit info
   */
  getRateLimitInfo(accessToken: string): Promise<{
    remaining: number;
    reset: Date;
    limit: number;
  }>;
}

export abstract class BaseJobBoardClient implements JobBoardAPIClient {
  protected baseUrl: string;
  protected providerName: string;

  constructor(baseUrl: string, providerName: string) {
    this.baseUrl = baseUrl;
    this.providerName = providerName;
  }

  abstract fetchJobs(params: JobBoardSearchParams, accessToken: string): Promise<JobBoardJob[]>;
  abstract getJobDetails(jobId: string, accessToken: string): Promise<JobBoardJob | null>;
  abstract validateToken(accessToken: string): Promise<boolean>;
  abstract getRateLimitInfo(accessToken: string): Promise<{
    remaining: number;
    reset: Date;
    limit: number;
  }>;

  /**
   * Make authenticated API request
   */
  protected async makeRequest<T>(
    endpoint: string,
    accessToken: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(
        `${this.providerName} API error: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  }

  /**
   * Normalize job data to common format
   */
  protected normalizeJob(rawJob: any, providerId: string): Partial<JobBoardJob> {
    return {
      external_id: rawJob.id || rawJob.jobId,
      provider_id: providerId,
      title: rawJob.title || rawJob.jobTitle,
      company: rawJob.company || rawJob.companyName,
      location: rawJob.location,
      description: rawJob.description || rawJob.jobDescription,
      requirements: rawJob.requirements || rawJob.qualifications,
      job_type: rawJob.jobType || rawJob.employmentType,
      remote: rawJob.remote || rawJob.isRemote || false,
      url: rawJob.url || rawJob.jobUrl,
      posted_date: rawJob.postedDate ? new Date(rawJob.postedDate) : undefined,
      raw_data: rawJob
    };
  }

  /**
   * Extract salary from various formats
   */
  protected extractSalary(rawJob: any): {
    salary_min?: number;
    salary_max?: number;
    salary_currency?: string;
  } {
    const salary: any = {};

    if (rawJob.salary) {
      if (typeof rawJob.salary === 'object') {
        salary.salary_min = rawJob.salary.min || rawJob.salary.minimum;
        salary.salary_max = rawJob.salary.max || rawJob.salary.maximum;
        salary.salary_currency = rawJob.salary.currency || 'USD';
      } else if (typeof rawJob.salary === 'string') {
        // Parse salary string like "$50,000 - $80,000"
        const match = rawJob.salary.match(/\$?([\d,]+)\s*-\s*\$?([\d,]+)/);
        if (match) {
          salary.salary_min = parseInt(match[1].replace(/,/g, ''));
          salary.salary_max = parseInt(match[2].replace(/,/g, ''));
          salary.salary_currency = 'USD';
        }
      }
    }

    return salary;
  }
}
