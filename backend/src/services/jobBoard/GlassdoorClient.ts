// Phase 7.1.1: Glassdoor Job Board Client
import { BaseJobBoardClient } from './BaseJobBoardClient';
import { JobBoardJob, JobBoardSearchParams } from '../../types/jobBoard';

export class GlassdoorClient extends BaseJobBoardClient {
  constructor() {
    super('https://api.glassdoor.com/api/v1', 'Glassdoor');
  }

  async fetchJobs(params: JobBoardSearchParams, accessToken: string): Promise<JobBoardJob[]> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.query) {
        searchParams.append('jobTitle', params.query);
      }
      
      if (params.location) {
        searchParams.append('location', params.location);
      }
      
      if (params.country) {
        searchParams.append('countryId', this.getCountryId(params.country));
      }
      
      if (params.remote) {
        searchParams.append('remoteWorkType', '1');
      }
      
      if (params.job_type) {
        searchParams.append('employmentType', params.job_type);
      }
      
      if (params.salary_min) {
        searchParams.append('fromSalary', params.salary_min.toString());
      }
      
      // Glassdoor specific: include ratings
      searchParams.append('includeRatings', 'true');
      searchParams.append('pageSize', '25');
      
      const endpoint = `/jobs/search?${searchParams.toString()}`;
      const response = await this.makeRequest<any>(endpoint, accessToken);
      
      const jobs = response.jobs || [];
      return jobs.map((job: any) => this.normalizeGlassdoorJob(job));
    } catch (error) {
      console.error('Glassdoor job fetch error:', error);
      throw error;
    }
  }

  async getJobDetails(jobId: string, accessToken: string): Promise<JobBoardJob | null> {
    try {
      const endpoint = `/jobs/${jobId}?includeRatings=true`;
      const job = await this.makeRequest<any>(endpoint, accessToken);
      
      return this.normalizeGlassdoorJob(job);
    } catch (error) {
      console.error('Glassdoor job details error:', error);
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
    // Glassdoor rate limits: typically 1000 requests per day
    return {
      remaining: 1000,
      reset: new Date(Date.now() + 86400000),
      limit: 1000
    };
  }

  private normalizeGlassdoorJob(job: any): JobBoardJob {
    const salary = this.extractGlassdoorSalary(job);

    return {
      id: job.jobId || job.id,
      external_id: job.jobId || job.id,
      provider_id: 'glassdoor',
      title: job.jobTitle || job.title || '',
      company: job.employer?.name || job.companyName || '',
      location: job.location?.name || job.location,
      country_code: job.location?.countryCode,
      description: job.jobDescription || job.description,
      requirements: job.qualifications,
      job_type: this.normalizeJobType(job.employmentType),
      remote: job.remoteWorkType === 1 || job.isRemote || false,
      url: job.jobUrl || `https://www.glassdoor.com/job-listing/${job.jobId}`,
      posted_date: job.postedDate ? new Date(job.postedDate) : undefined,
      is_premium_listing: job.featured || false,
      salary_min: salary.min,
      salary_max: salary.max,
      salary_currency: salary.currency || 'USD',
      raw_data: {
        ...job,
        companyRating: job.employer?.rating,
        reviewCount: job.employer?.numberOfReviews
      },
      created_at: new Date(),
      updated_at: new Date()
    } as JobBoardJob;
  }

  private extractGlassdoorSalary(job: any): {
    min?: number;
    max?: number;
    currency?: string;
  } {
    if (job.salary) {
      return {
        min: job.salary.min || job.salary.salaryMin,
        max: job.salary.max || job.salary.salaryMax,
        currency: job.salary.currency || 'USD'
      };
    }

    if (job.salaryEstimate) {
      const match = job.salaryEstimate.match(/\$?([\d,]+)K?\s*-\s*\$?([\d,]+)K?/);
      if (match) {
        const multiplier = job.salaryEstimate.includes('K') ? 1000 : 1;
        return {
          min: parseInt(match[1].replace(/,/g, '')) * multiplier,
          max: parseInt(match[2].replace(/,/g, '')) * multiplier,
          currency: 'USD'
        };
      }
    }

    return {};
  }

  private normalizeJobType(glassdoorType?: string): string {
    if (!glassdoorType) return 'full-time';
    
    const typeMap: Record<string, string> = {
      'FULL_TIME': 'full-time',
      'PART_TIME': 'part-time',
      'CONTRACT': 'contract',
      'TEMPORARY': 'temporary',
      'INTERN': 'internship'
    };
    
    return typeMap[glassdoorType.toUpperCase()] || 'full-time';
  }

  private getCountryId(countryCode: string): string {
    const countryMap: Record<string, string> = {
      'US': '1',
      'UK': '2',
      'CA': '3',
      'AU': '4',
      'IN': '5',
      'DE': '6',
      'FR': '7'
    };
    
    return countryMap[countryCode.toUpperCase()] || '1';
  }
}
