// Phase 7.1.1: Dice Job Board Client (Tech-Specific)
import { BaseJobBoardClient } from './BaseJobBoardClient';
import { JobBoardJob, JobBoardSearchParams } from '../../types/jobBoard';

export class DiceClient extends BaseJobBoardClient {
  constructor() {
    super('https://api.dice.com/v1', 'Dice');
  }

  async fetchJobs(params: JobBoardSearchParams, accessToken: string): Promise<JobBoardJob[]> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.query) {
        searchParams.append('q', params.query);
      }
      
      if (params.location) {
        searchParams.append('location', params.location);
      }
      
      if (params.country) {
        searchParams.append('countryCode', params.country);
      }
      
      if (params.remote) {
        searchParams.append('postedDate', 'ONE');
        searchParams.append('employmentType', 'CONTRACTS');
      }
      
      if (params.job_type) {
        searchParams.append('employmentType', this.getDiceEmploymentType(params.job_type));
      }
      
      if (params.salary_min) {
        searchParams.append('salary', params.salary_min.toString());
      }
      
      if (params.posted_within_days) {
        searchParams.append('age', params.posted_within_days.toString());
      }
      
      searchParams.append('pageSize', '25');
      
      const endpoint = `/jobs/search?${searchParams.toString()}`;
      const response = await this.makeRequest<any>(endpoint, accessToken);
      
      const jobs = response.data || [];
      return jobs.map((job: any) => this.normalizeDiceJob(job));
    } catch (error) {
      console.error('Dice job fetch error:', error);
      throw error;
    }
  }

  async getJobDetails(jobId: string, accessToken: string): Promise<JobBoardJob | null> {
    try {
      const endpoint = `/jobs/${jobId}`;
      const job = await this.makeRequest<any>(endpoint, accessToken);
      
      return this.normalizeDiceJob(job);
    } catch (error) {
      console.error('Dice job details error:', error);
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
    // Dice rate limits: typically 150 requests per hour
    return {
      remaining: 150,
      reset: new Date(Date.now() + 3600000),
      limit: 150
    };
  }

  private normalizeDiceJob(job: any): JobBoardJob {
    const salary = this.extractDiceSalary(job);

    return {
      id: job.id || job.jobId,
      external_id: job.id || job.jobId,
      provider_id: 'dice',
      title: job.title || job.jobTitle || '',
      company: job.companyName || job.company || '',
      location: job.jobLocation?.displayName || job.location,
      country_code: job.jobLocation?.countryCode || 'US',
      description: job.summary || job.description,
      requirements: job.skills || job.requirements,
      job_type: this.normalizeJobType(job.employmentType),
      remote: job.isRemote || job.remoteOption === 'Remote' || false,
      url: job.detailsPageUrl || job.url,
      posted_date: job.postedDate ? new Date(job.postedDate) : undefined,
      is_premium_listing: job.featured || false,
      salary_min: salary.min,
      salary_max: salary.max,
      salary_currency: salary.currency || 'USD',
      raw_data: {
        ...job,
        skills: job.skills,
        certifications: job.certifications,
        clearanceRequired: job.clearanceRequired,
        travelPercentage: job.travelPercentage
      },
      created_at: new Date(),
      updated_at: new Date()
    } as JobBoardJob;
  }

  private extractDiceSalary(job: any): {
    min?: number;
    max?: number;
    currency?: string;
  } {
    if (job.salary) {
      return {
        min: job.salary.min,
        max: job.salary.max,
        currency: job.salary.currency || 'USD'
      };
    }

    if (job.compensationString) {
      // Parse salary string like "$80K - $120K"
      const match = job.compensationString.match(/\$?([\d,]+)K?\s*-\s*\$?([\d,]+)K?/);
      if (match) {
        const multiplier = job.compensationString.includes('K') ? 1000 : 1;
        return {
          min: parseInt(match[1].replace(/,/g, '')) * multiplier,
          max: parseInt(match[2].replace(/,/g, '')) * multiplier,
          currency: 'USD'
        };
      }
    }

    return {};
  }

  private normalizeJobType(diceType?: string): string {
    if (!diceType) return 'full-time';
    
    const typeMap: Record<string, string> = {
      'FULL_TIME': 'full-time',
      'PART_TIME': 'part-time',
      'CONTRACTS': 'contract',
      'CONTRACT_TO_HIRE': 'contract',
      'THIRD_PARTY': 'contract'
    };
    
    return typeMap[diceType.toUpperCase()] || 'full-time';
  }

  private getDiceEmploymentType(jobType: string): string {
    const typeMap: Record<string, string> = {
      'full-time': 'FULL_TIME',
      'part-time': 'PART_TIME',
      'contract': 'CONTRACTS',
      'temporary': 'CONTRACTS'
    };
    
    return typeMap[jobType.toLowerCase()] || 'FULL_TIME';
  }
}
