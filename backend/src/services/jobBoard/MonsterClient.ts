// Phase 7.1.1: Monster Job Board Client
import { BaseJobBoardClient } from './BaseJobBoardClient';
import { JobBoardJob, JobBoardSearchParams } from '../../types/jobBoard';

export class MonsterClient extends BaseJobBoardClient {
  constructor() {
    super('https://api.monster.com/v1', 'Monster');
  }

  async fetchJobs(params: JobBoardSearchParams, accessToken: string): Promise<JobBoardJob[]> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.query) {
        searchParams.append('q', params.query);
      }
      
      if (params.location) {
        searchParams.append('where', params.location);
      }
      
      if (params.country) {
        searchParams.append('cy', params.country);
      }
      
      if (params.remote) {
        searchParams.append('tm', '1'); // telecommute
      }
      
      if (params.job_type) {
        searchParams.append('jt', this.getMonsterJobType(params.job_type));
      }
      
      if (params.salary_min) {
        searchParams.append('sal', params.salary_min.toString());
      }
      
      if (params.posted_within_days) {
        searchParams.append('tm', params.posted_within_days.toString());
      }
      
      searchParams.append('page', '1');
      searchParams.append('pageSize', '25');
      
      const endpoint = `/jobs/search?${searchParams.toString()}`;
      const response = await this.makeRequest<any>(endpoint, accessToken);
      
      const jobs = response.results || [];
      return jobs.map((job: any) => this.normalizeMonsterJob(job));
    } catch (error) {
      console.error('Monster job fetch error:', error);
      throw error;
    }
  }

  async getJobDetails(jobId: string, accessToken: string): Promise<JobBoardJob | null> {
    try {
      const endpoint = `/jobs/${jobId}`;
      const job = await this.makeRequest<any>(endpoint, accessToken);
      
      return this.normalizeMonsterJob(job);
    } catch (error) {
      console.error('Monster job details error:', error);
      return null;
    }
  }

  async validateToken(accessToken: string): Promise<boolean> {
    try {
      await this.makeRequest<any>('/auth/validate', accessToken);
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
    // Monster rate limits: typically 200 requests per hour
    return {
      remaining: 200,
      reset: new Date(Date.now() + 3600000),
      limit: 200
    };
  }

  private normalizeMonsterJob(job: any): JobBoardJob {
    const salary = this.extractMonsterSalary(job);

    return {
      id: job.jobId || job.id,
      external_id: job.jobId || job.id,
      provider_id: 'monster',
      title: job.title || job.jobTitle || '',
      company: job.company?.name || job.companyName || '',
      location: job.location?.displayName || job.location,
      country_code: job.location?.countryCode,
      description: job.description || job.jobDescription,
      requirements: job.requirements || job.qualifications,
      job_type: this.normalizeJobType(job.jobType),
      remote: job.isTelecommute || job.remote || false,
      url: job.applyUrl || job.url || `https://www.monster.com/job-openings/${job.jobId}`,
      posted_date: job.postedDate ? new Date(job.postedDate) : undefined,
      expires_date: job.expirationDate ? new Date(job.expirationDate) : undefined,
      is_premium_listing: job.featured || false,
      salary_min: salary.min,
      salary_max: salary.max,
      salary_currency: salary.currency || 'USD',
      raw_data: {
        ...job,
        company_logo: job.company?.logoUrl,
        apply_requirements: job.applyRequirements
      },
      created_at: new Date(),
      updated_at: new Date()
    } as JobBoardJob;
  }

  private extractMonsterSalary(job: any): {
    min?: number;
    max?: number;
    currency?: string;
  } {
    if (job.salary) {
      return {
        min: job.salary.min || job.salary.minValue,
        max: job.salary.max || job.salary.maxValue,
        currency: job.salary.currency || 'USD'
      };
    }

    if (job.salaryRange) {
      const match = job.salaryRange.match(/\$?([\d,]+)\s*-\s*\$?([\d,]+)/);
      if (match) {
        return {
          min: parseInt(match[1].replace(/,/g, '')),
          max: parseInt(match[2].replace(/,/g, '')),
          currency: 'USD'
        };
      }
    }

    return {};
  }

  private normalizeJobType(monsterType?: string): string {
    if (!monsterType) return 'full-time';
    
    const typeMap: Record<string, string> = {
      'Full-Time': 'full-time',
      'Part-Time': 'part-time',
      'Contract': 'contract',
      'Temporary': 'temporary',
      'Internship': 'internship',
      'Seasonal': 'temporary'
    };
    
    return typeMap[monsterType] || 'full-time';
  }

  private getMonsterJobType(jobType: string): string {
    const typeMap: Record<string, string> = {
      'full-time': 'Full-Time',
      'part-time': 'Part-Time',
      'contract': 'Contract',
      'temporary': 'Temporary',
      'internship': 'Internship'
    };
    
    return typeMap[jobType.toLowerCase()] || 'Full-Time';
  }
}
