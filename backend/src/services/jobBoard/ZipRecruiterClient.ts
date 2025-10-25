// Phase 7.1.1: ZipRecruiter Job Board Client
import { BaseJobBoardClient } from './BaseJobBoardClient';
import { JobBoardJob, JobBoardSearchParams } from '../../types/jobBoard';

export class ZipRecruiterClient extends BaseJobBoardClient {
  constructor() {
    super('https://api.ziprecruiter.com/v2', 'ZipRecruiter');
  }

  async fetchJobs(params: JobBoardSearchParams, accessToken: string): Promise<JobBoardJob[]> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.query) {
        searchParams.append('search', params.query);
      }
      
      if (params.location) {
        searchParams.append('location', params.location);
      }
      
      if (params.remote) {
        searchParams.append('refine_by_location_type', 'only_remote');
      }
      
      if (params.job_type) {
        searchParams.append('refine_by_employment', params.job_type);
      }
      
      if (params.salary_min) {
        searchParams.append('refine_by_salary', params.salary_min.toString());
      }
      
      if (params.posted_within_days) {
        searchParams.append('days_ago', params.posted_within_days.toString());
      }
      
      // ZipRecruiter specific: AI matching
      searchParams.append('jobs_per_page', '25');
      searchParams.append('include_match_score', 'true');
      
      const endpoint = `/jobs?${searchParams.toString()}`;
      const response = await this.makeRequest<any>(endpoint, accessToken);
      
      const jobs = response.jobs || [];
      return jobs.map((job: any) => this.normalizeZipRecruiterJob(job));
    } catch (error) {
      console.error('ZipRecruiter job fetch error:', error);
      throw error;
    }
  }

  async getJobDetails(jobId: string, accessToken: string): Promise<JobBoardJob | null> {
    try {
      const endpoint = `/jobs/${jobId}`;
      const job = await this.makeRequest<any>(endpoint, accessToken);
      
      return this.normalizeZipRecruiterJob(job);
    } catch (error) {
      console.error('ZipRecruiter job details error:', error);
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
    // ZipRecruiter rate limits: typically 500 requests per hour
    return {
      remaining: 500,
      reset: new Date(Date.now() + 3600000),
      limit: 500
    };
  }

  private normalizeZipRecruiterJob(job: any): JobBoardJob {
    const salary = this.extractZipRecruiterSalary(job);

    return {
      id: job.job_id || job.id,
      external_id: job.job_id || job.id,
      provider_id: 'ziprecruiter',
      title: job.name || job.title || '',
      company: job.hiring_company?.name || job.company || '',
      location: job.location || job.city_state,
      country_code: job.country || 'US',
      description: job.snippet || job.job_description,
      requirements: job.job_requirements,
      job_type: this.normalizeJobType(job.employment_type),
      remote: job.location_type === 'remote' || job.is_remote || false,
      url: job.url || job.job_url,
      posted_date: job.posted_time ? new Date(job.posted_time) : undefined,
      is_premium_listing: job.featured || job.is_sponsored || false,
      salary_min: salary.min,
      salary_max: salary.max,
      salary_currency: salary.currency || 'USD',
      raw_data: {
        ...job,
        match_score: job.match_score,
        urgency_indicator: job.urgency_indicator,
        easy_apply: job.easy_apply
      },
      created_at: new Date(),
      updated_at: new Date()
    } as JobBoardJob;
  }

  private extractZipRecruiterSalary(job: any): {
    min?: number;
    max?: number;
    currency?: string;
  } {
    if (job.compensation) {
      return {
        min: job.compensation.min_annual_salary,
        max: job.compensation.max_annual_salary,
        currency: job.compensation.currency || 'USD'
      };
    }

    if (job.salary_interval && job.salary_min && job.salary_max) {
      const multiplier = job.salary_interval === 'yearly' ? 1 : 
                        job.salary_interval === 'monthly' ? 12 : 
                        job.salary_interval === 'hourly' ? 2080 : 1;
      
      return {
        min: job.salary_min * multiplier,
        max: job.salary_max * multiplier,
        currency: 'USD'
      };
    }

    return {};
  }

  private normalizeJobType(zipType?: string): string {
    if (!zipType) return 'full-time';
    
    const typeMap: Record<string, string> = {
      'full_time': 'full-time',
      'part_time': 'part-time',
      'contract': 'contract',
      'temporary': 'temporary',
      'internship': 'internship'
    };
    
    return typeMap[zipType.toLowerCase()] || 'full-time';
  }
}
