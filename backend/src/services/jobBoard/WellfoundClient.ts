// Phase 7.1.1: Wellfound (AngelList) Job Board Client (Startups & Tech)
import { BaseJobBoardClient } from './BaseJobBoardClient';
import { JobBoardJob, JobBoardSearchParams } from '../../types/jobBoard';

export class WellfoundClient extends BaseJobBoardClient {
  constructor() {
    super('https://api.wellfound.com/v1', 'Wellfound');
  }

  async fetchJobs(params: JobBoardSearchParams, accessToken: string): Promise<JobBoardJob[]> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.query) {
        searchParams.append('role', params.query);
      }
      
      if (params.location) {
        searchParams.append('location', params.location);
      }
      
      if (params.remote) {
        searchParams.append('remote', 'true');
      }
      
      if (params.job_type) {
        searchParams.append('type', this.getWellfoundJobType(params.job_type));
      }
      
      if (params.salary_min) {
        searchParams.append('min_salary', params.salary_min.toString());
      }
      
      // Wellfound specific: startup stage, equity
      searchParams.append('per_page', '25');
      
      const endpoint = `/jobs?${searchParams.toString()}`;
      const response = await this.makeRequest<any>(endpoint, accessToken);
      
      const jobs = response.jobs || response.startups || [];
      return jobs.flatMap((item: any) => 
        item.jobs ? item.jobs.map((job: any) => this.normalizeWellfoundJob(job, item)) : 
        [this.normalizeWellfoundJob(item)]
      );
    } catch (error) {
      console.error('Wellfound job fetch error:', error);
      throw error;
    }
  }

  async getJobDetails(jobId: string, accessToken: string): Promise<JobBoardJob | null> {
    try {
      const endpoint = `/jobs/${jobId}`;
      const job = await this.makeRequest<any>(endpoint, accessToken);
      
      return this.normalizeWellfoundJob(job);
    } catch (error) {
      console.error('Wellfound job details error:', error);
      return null;
    }
  }

  async validateToken(accessToken: string): Promise<boolean> {
    try {
      await this.makeRequest<any>('/me', accessToken);
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
    // Wellfound rate limits: typically 100 requests per hour
    return {
      remaining: 100,
      reset: new Date(Date.now() + 3600000),
      limit: 100
    };
  }

  private normalizeWellfoundJob(job: any, startup?: any): JobBoardJob {
    const salary = this.extractWellfoundSalary(job);
    const company = startup || job.startup || {};

    return {
      id: job.id?.toString() || job.jobId,
      external_id: job.id?.toString() || job.jobId,
      provider_id: 'wellfound',
      title: job.title || job.role || '',
      company: company.name || job.company_name || '',
      location: job.location_name || job.location,
      country_code: job.country_code || 'US',
      description: job.description || job.job_description,
      requirements: job.requirements || job.skills?.join(', '),
      job_type: this.normalizeJobType(job.job_type),
      remote: job.remote || job.remote_ok || false,
      url: job.angellist_url || job.url || `https://wellfound.com/l/${job.id}`,
      posted_date: job.created_at ? new Date(job.created_at) : undefined,
      is_premium_listing: company.quality_score > 7 || false,
      salary_min: salary.min,
      salary_max: salary.max,
      salary_currency: salary.currency || 'USD',
      raw_data: {
        ...job,
        startup_name: company.name,
        startup_size: company.company_size,
        startup_stage: company.stage,
        equity_min: job.equity_min,
        equity_max: job.equity_max,
        visa_sponsorship: job.visa_sponsorship,
        quality_score: company.quality_score
      },
      created_at: new Date(),
      updated_at: new Date()
    } as JobBoardJob;
  }

  private extractWellfoundSalary(job: any): {
    min?: number;
    max?: number;
    currency?: string;
  } {
    if (job.salary_min && job.salary_max) {
      return {
        min: job.salary_min,
        max: job.salary_max,
        currency: job.currency_code || 'USD'
      };
    }

    if (job.salary_range) {
      const match = job.salary_range.match(/\$?([\d,]+)k?\s*-\s*\$?([\d,]+)k?/i);
      if (match) {
        const multiplier = job.salary_range.toLowerCase().includes('k') ? 1000 : 1;
        return {
          min: parseInt(match[1].replace(/,/g, '')) * multiplier,
          max: parseInt(match[2].replace(/,/g, '')) * multiplier,
          currency: 'USD'
        };
      }
    }

    return {};
  }

  private normalizeJobType(wellfoundType?: string): string {
    if (!wellfoundType) return 'full-time';
    
    const typeMap: Record<string, string> = {
      'full-time': 'full-time',
      'part-time': 'part-time',
      'contract': 'contract',
      'internship': 'internship',
      'cofounder': 'full-time'
    };
    
    return typeMap[wellfoundType.toLowerCase()] || 'full-time';
  }

  private getWellfoundJobType(jobType: string): string {
    const typeMap: Record<string, string> = {
      'full-time': 'full-time',
      'part-time': 'part-time',
      'contract': 'contract',
      'internship': 'internship'
    };
    
    return typeMap[jobType.toLowerCase()] || 'full-time';
  }
}
