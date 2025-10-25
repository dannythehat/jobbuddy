// Phase 7.1.1: Reed Job Board Client (UK)
import { BaseJobBoardClient } from './BaseJobBoardClient';
import { JobBoardJob, JobBoardSearchParams } from '../../types/jobBoard';

export class ReedClient extends BaseJobBoardClient {
  constructor() {
    super('https://www.reed.co.uk/api/1.0', 'Reed');
  }

  async fetchJobs(params: JobBoardSearchParams, accessToken: string): Promise<JobBoardJob[]> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.query) {
        searchParams.append('keywords', params.query);
      }
      
      if (params.location) {
        searchParams.append('locationName', params.location);
      }
      
      if (params.remote) {
        searchParams.append('workFromHome', 'true');
      }
      
      if (params.job_type) {
        searchParams.append('employmentType', this.getReedEmploymentType(params.job_type));
      }
      
      if (params.salary_min) {
        searchParams.append('minimumSalary', params.salary_min.toString());
      }
      
      if (params.salary_max) {
        searchParams.append('maximumSalary', params.salary_max.toString());
      }
      
      if (params.posted_within_days) {
        searchParams.append('postedByDays', params.posted_within_days.toString());
      }
      
      searchParams.append('resultsToTake', '25');
      
      const endpoint = `/search?${searchParams.toString()}`;
      const response = await this.makeRequest<any>(endpoint, accessToken);
      
      const jobs = response.results || [];
      return jobs.map((job: any) => this.normalizeReedJob(job));
    } catch (error) {
      console.error('Reed job fetch error:', error);
      throw error;
    }
  }

  async getJobDetails(jobId: string, accessToken: string): Promise<JobBoardJob | null> {
    try {
      const endpoint = `/jobs/${jobId}`;
      const job = await this.makeRequest<any>(endpoint, accessToken);
      
      return this.normalizeReedJob(job);
    } catch (error) {
      console.error('Reed job details error:', error);
      return null;
    }
  }

  async validateToken(accessToken: string): Promise<boolean> {
    try {
      // Reed uses Basic Auth with API key, test with a simple request
      await this.makeRequest<any>('/search?resultsToTake=1', accessToken);
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
    // Reed rate limits: typically 200 requests per hour
    return {
      remaining: 200,
      reset: new Date(Date.now() + 3600000),
      limit: 200
    };
  }

  protected async makeRequest<T>(
    endpoint: string,
    accessToken: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Reed uses Basic Auth with API key as username
    const auth = Buffer.from(`${accessToken}:`).toString('base64');
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Basic ${auth}`,
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

  private normalizeReedJob(job: any): JobBoardJob {
    return {
      id: job.jobId?.toString() || job.id,
      external_id: job.jobId?.toString() || job.id,
      provider_id: 'reed',
      title: job.jobTitle || job.title || '',
      company: job.employerName || job.company || '',
      location: job.locationName || job.location,
      country_code: 'GB', // Reed is UK-focused
      description: job.jobDescription || job.description,
      requirements: job.requirements,
      job_type: this.normalizeJobType(job.employmentType),
      remote: job.workFromHome || false,
      url: job.jobUrl || `https://www.reed.co.uk/jobs/${job.jobId}`,
      posted_date: job.date ? new Date(job.date) : undefined,
      expires_date: job.expirationDate ? new Date(job.expirationDate) : undefined,
      is_premium_listing: job.featured || false,
      salary_min: job.minimumSalary,
      salary_max: job.maximumSalary,
      salary_currency: 'GBP',
      raw_data: {
        ...job,
        applications: job.applications,
        partTime: job.partTime,
        fullTime: job.fullTime,
        contractType: job.contractType
      },
      created_at: new Date(),
      updated_at: new Date()
    } as JobBoardJob;
  }

  private normalizeJobType(reedType?: string): string {
    if (!reedType) return 'full-time';
    
    const typeMap: Record<string, string> = {
      'permanent': 'full-time',
      'contract': 'contract',
      'temporary': 'temporary',
      'part-time': 'part-time',
      'internship': 'internship'
    };
    
    return typeMap[reedType.toLowerCase()] || 'full-time';
  }

  private getReedEmploymentType(jobType: string): string {
    const typeMap: Record<string, string> = {
      'full-time': 'permanent',
      'part-time': 'part-time',
      'contract': 'contract',
      'temporary': 'temporary',
      'internship': 'internship'
    };
    
    return typeMap[jobType.toLowerCase()] || 'permanent';
  }
}
