// Phase 7.1.1: Seek Job Board Client (Australia/NZ)
import { BaseJobBoardClient } from './BaseJobBoardClient';
import { JobBoardJob, JobBoardSearchParams } from '../../types/jobBoard';

export class SeekClient extends BaseJobBoardClient {
  constructor() {
    super('https://api.seek.com/v4', 'Seek');
  }

  async fetchJobs(params: JobBoardSearchParams, accessToken: string): Promise<JobBoardJob[]> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.query) {
        searchParams.append('keywords', params.query);
      }
      
      if (params.location) {
        searchParams.append('where', params.location);
      }
      
      if (params.country) {
        searchParams.append('siteKey', this.getSeekSiteKey(params.country));
      }
      
      if (params.remote) {
        searchParams.append('workType', 'work-from-home');
      }
      
      if (params.job_type) {
        searchParams.append('workType', this.getSeekWorkType(params.job_type));
      }
      
      if (params.salary_min) {
        searchParams.append('salaryFrom', params.salary_min.toString());
      }
      
      if (params.posted_within_days) {
        searchParams.append('dateRange', params.posted_within_days.toString());
      }
      
      searchParams.append('pageSize', '25');
      
      const endpoint = `/jobs?${searchParams.toString()}`;
      const response = await this.makeRequest<any>(endpoint, accessToken);
      
      const jobs = response.data || [];
      return jobs.map((job: any) => this.normalizeSeekJob(job));
    } catch (error) {
      console.error('Seek job fetch error:', error);
      throw error;
    }
  }

  async getJobDetails(jobId: string, accessToken: string): Promise<JobBoardJob | null> {
    try {
      const endpoint = `/jobs/${jobId}`;
      const job = await this.makeRequest<any>(endpoint, accessToken);
      
      return this.normalizeSeekJob(job);
    } catch (error) {
      console.error('Seek job details error:', error);
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
    // Seek rate limits: typically 300 requests per hour
    return {
      remaining: 300,
      reset: new Date(Date.now() + 3600000),
      limit: 300
    };
  }

  private normalizeSeekJob(job: any): JobBoardJob {
    const salary = this.extractSeekSalary(job);

    return {
      id: job.id || job.jobId,
      external_id: job.id || job.jobId,
      provider_id: 'seek',
      title: job.title || job.jobTitle || '',
      company: job.advertiser?.name || job.company || '',
      location: job.location?.label || job.location,
      country_code: job.location?.countryCode || 'AU',
      description: job.content || job.description,
      requirements: job.requirements,
      job_type: this.normalizeJobType(job.workType),
      remote: job.workType === 'work-from-home' || false,
      url: job.url || `https://www.seek.com.au/job/${job.id}`,
      posted_date: job.listedAt ? new Date(job.listedAt) : undefined,
      is_premium_listing: job.isPremium || job.standOut || false,
      salary_min: salary.min,
      salary_max: salary.max,
      salary_currency: salary.currency || 'AUD',
      raw_data: {
        ...job,
        classification: job.classification,
        subClassification: job.subClassification,
        standOut: job.standOut
      },
      created_at: new Date(),
      updated_at: new Date()
    } as JobBoardJob;
  }

  private extractSeekSalary(job: any): {
    min?: number;
    max?: number;
    currency?: string;
  } {
    if (job.salary) {
      return {
        min: job.salary.minimum,
        max: job.salary.maximum,
        currency: job.salary.currencyCode || 'AUD'
      };
    }

    if (job.salaryRange) {
      const match = job.salaryRange.match(/\$?([\d,]+)\s*-\s*\$?([\d,]+)/);
      if (match) {
        return {
          min: parseInt(match[1].replace(/,/g, '')),
          max: parseInt(match[2].replace(/,/g, '')),
          currency: 'AUD'
        };
      }
    }

    return {};
  }

  private normalizeJobType(seekType?: string): string {
    if (!seekType) return 'full-time';
    
    const typeMap: Record<string, string> = {
      'full-time': 'full-time',
      'part-time': 'part-time',
      'contract-temp': 'contract',
      'casual-vacation': 'temporary',
      'work-from-home': 'full-time'
    };
    
    return typeMap[seekType.toLowerCase()] || 'full-time';
  }

  private getSeekWorkType(jobType: string): string {
    const typeMap: Record<string, string> = {
      'full-time': 'full-time',
      'part-time': 'part-time',
      'contract': 'contract-temp',
      'temporary': 'casual-vacation'
    };
    
    return typeMap[jobType.toLowerCase()] || 'full-time';
  }

  private getSeekSiteKey(countryCode: string): string {
    const siteMap: Record<string, string> = {
      'AU': 'seek-au',
      'NZ': 'seek-nz',
      'HK': 'jobsdb-hk',
      'SG': 'jobsdb-sg',
      'TH': 'jobsdb-th'
    };
    
    return siteMap[countryCode.toUpperCase()] || 'seek-au';
  }
}
