// Phase 7.1.1: Naukri Job Board Client (India)
import { BaseJobBoardClient } from './BaseJobBoardClient';
import { JobBoardJob, JobBoardSearchParams } from '../../types/jobBoard';

export class NaukriClient extends BaseJobBoardClient {
  constructor() {
    super('https://api.naukri.com/v3', 'Naukri');
  }

  async fetchJobs(params: JobBoardSearchParams, accessToken: string): Promise<JobBoardJob[]> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.query) {
        searchParams.append('keywords', params.query);
      }
      
      if (params.location) {
        searchParams.append('location', params.location);
      }
      
      if (params.remote) {
        searchParams.append('workMode', 'work-from-home');
      }
      
      if (params.job_type) {
        searchParams.append('jobType', this.getNaukriJobType(params.job_type));
      }
      
      if (params.salary_min) {
        // Naukri uses lakhs (1 lakh = 100,000)
        const lakhs = Math.floor(params.salary_min / 100000);
        searchParams.append('salaryMin', lakhs.toString());
      }
      
      if (params.posted_within_days) {
        searchParams.append('postedWithin', params.posted_within_days.toString());
      }
      
      searchParams.append('pageSize', '25');
      
      const endpoint = `/jobsearch?${searchParams.toString()}`;
      const response = await this.makeRequest<any>(endpoint, accessToken);
      
      const jobs = response.jobDetails || [];
      return jobs.map((job: any) => this.normalizeNaukriJob(job));
    } catch (error) {
      console.error('Naukri job fetch error:', error);
      throw error;
    }
  }

  async getJobDetails(jobId: string, accessToken: string): Promise<JobBoardJob | null> {
    try {
      const endpoint = `/jobdetails/${jobId}`;
      const job = await this.makeRequest<any>(endpoint, accessToken);
      
      return this.normalizeNaukriJob(job);
    } catch (error) {
      console.error('Naukri job details error:', error);
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
    // Naukri rate limits: typically 250 requests per hour
    return {
      remaining: 250,
      reset: new Date(Date.now() + 3600000),
      limit: 250
    };
  }

  private normalizeNaukriJob(job: any): JobBoardJob {
    const salary = this.extractNaukriSalary(job);

    return {
      id: job.jobId || job.id,
      external_id: job.jobId || job.id,
      provider_id: 'naukri',
      title: job.title || job.jobTitle || '',
      company: job.companyName || job.company || '',
      location: job.placeholders?.location || job.location,
      country_code: 'IN',
      description: job.jobDescription || job.description,
      requirements: job.keySkills || job.requirements,
      job_type: this.normalizeJobType(job.jobType),
      remote: job.workMode === 'work-from-home' || false,
      url: job.jdURL || `https://www.naukri.com/job-listings-${job.jobId}`,
      posted_date: job.createdDate ? new Date(job.createdDate) : undefined,
      is_premium_listing: job.isPremium || job.isHot || false,
      salary_min: salary.min,
      salary_max: salary.max,
      salary_currency: 'INR',
      raw_data: {
        ...job,
        experience: job.experience,
        education: job.education,
        industry: job.industry,
        functionalArea: job.functionalArea
      },
      created_at: new Date(),
      updated_at: new Date()
    } as JobBoardJob;
  }

  private extractNaukriSalary(job: any): {
    min?: number;
    max?: number;
    currency?: string;
  } {
    if (job.salary) {
      // Naukri provides salary in lakhs (1 lakh = 100,000 INR)
      return {
        min: job.salary.min ? job.salary.min * 100000 : undefined,
        max: job.salary.max ? job.salary.max * 100000 : undefined,
        currency: 'INR'
      };
    }

    if (job.placeholders?.salary) {
      // Parse salary string like "5-8 Lacs PA"
      const match = job.placeholders.salary.match(/([\d.]+)\s*-\s*([\d.]+)\s*Lacs?/i);
      if (match) {
        return {
          min: parseFloat(match[1]) * 100000,
          max: parseFloat(match[2]) * 100000,
          currency: 'INR'
        };
      }
    }

    return {};
  }

  private normalizeJobType(naukriType?: string): string {
    if (!naukriType) return 'full-time';
    
    const typeMap: Record<string, string> = {
      'permanent': 'full-time',
      'contractual': 'contract',
      'temporary': 'temporary',
      'part-time': 'part-time',
      'internship': 'internship'
    };
    
    return typeMap[naukriType.toLowerCase()] || 'full-time';
  }

  private getNaukriJobType(jobType: string): string {
    const typeMap: Record<string, string> = {
      'full-time': 'permanent',
      'contract': 'contractual',
      'temporary': 'temporary',
      'part-time': 'part-time',
      'internship': 'internship'
    };
    
    return typeMap[jobType.toLowerCase()] || 'permanent';
  }
}
