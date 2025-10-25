// Phase 7.1.1: LinkedIn Job Board Client
import { BaseJobBoardClient } from './BaseJobBoardClient';
import { JobBoardJob, JobBoardSearchParams } from '../../types/jobBoard';

export class LinkedInClient extends BaseJobBoardClient {
  constructor() {
    super('https://api.linkedin.com/v2', 'LinkedIn');
  }

  async fetchJobs(params: JobBoardSearchParams, accessToken: string): Promise<JobBoardJob[]> {
    try {
      // Build search query
      const searchParams = new URLSearchParams();
      
      if (params.query) {
        searchParams.append('keywords', params.query);
      }
      
      if (params.location) {
        searchParams.append('location', params.location);
      }
      
      if (params.remote) {
        searchParams.append('f_WT', '2'); // Remote filter
      }
      
      if (params.job_type) {
        searchParams.append('f_JT', this.mapJobType(params.job_type));
      }
      
      if (params.posted_within_days) {
        searchParams.append('f_TPR', `r${params.posted_within_days * 86400}`);
      }

      // LinkedIn Jobs API endpoint
      const endpoint = `/jobs?${searchParams.toString()}`;
      
      const response = await this.makeRequest<any>(endpoint, accessToken);
      
      // Normalize jobs to common format
      const jobs = response.elements || response.jobs || [];
      
      return jobs.map((job: any) => this.normalizeLinkedInJob(job));
    } catch (error) {
      console.error('LinkedIn job fetch error:', error);
      throw error;
    }
  }

  async getJobDetails(jobId: string, accessToken: string): Promise<JobBoardJob | null> {
    try {
      const endpoint = `/jobs/${jobId}`;
      const job = await this.makeRequest<any>(endpoint, accessToken);
      
      return this.normalizeLinkedInJob(job);
    } catch (error) {
      console.error('LinkedIn job details error:', error);
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
    // LinkedIn doesn't expose rate limit info in headers consistently
    // Return default values
    return {
      remaining: 100,
      reset: new Date(Date.now() + 3600000), // 1 hour from now
      limit: 100
    };
  }

  /**
   * Normalize LinkedIn job to common format
   */
  private normalizeLinkedInJob(job: any): JobBoardJob {
    const normalized = this.normalizeJob(job, 'linkedin');
    const salary = this.extractSalary(job);

    return {
      id: job.id || job.jobId,
      external_id: job.id || job.jobId,
      provider_id: 'linkedin',
      title: job.title || job.jobTitle || '',
      company: job.companyName || job.company?.name || '',
      location: job.location || job.formattedLocation,
      country_code: this.extractCountryCode(job.location),
      description: job.description?.text || job.description,
      requirements: job.qualifications || job.requirements,
      job_type: this.normalizeJobType(job.employmentType),
      remote: job.workRemoteAllowed || false,
      url: job.jobUrl || `https://www.linkedin.com/jobs/view/${job.id}`,
      posted_date: job.listedAt ? new Date(job.listedAt) : undefined,
      expires_date: job.expireAt ? new Date(job.expireAt) : undefined,
      is_premium_listing: true, // LinkedIn jobs are premium
      salary_min: salary.salary_min,
      salary_max: salary.salary_max,
      salary_currency: salary.salary_currency || 'USD',
      raw_data: job,
      created_at: new Date(),
      updated_at: new Date()
    } as JobBoardJob;
  }

  /**
   * Map generic job type to LinkedIn format
   */
  private mapJobType(jobType: string): string {
    const typeMap: Record<string, string> = {
      'full-time': 'F',
      'part-time': 'P',
      'contract': 'C',
      'temporary': 'T',
      'internship': 'I',
      'volunteer': 'V'
    };
    
    return typeMap[jobType.toLowerCase()] || 'F';
  }

  /**
   * Normalize LinkedIn job type to generic format
   */
  private normalizeJobType(linkedInType: string): string {
    const typeMap: Record<string, string> = {
      'F': 'full-time',
      'P': 'part-time',
      'C': 'contract',
      'T': 'temporary',
      'I': 'internship',
      'V': 'volunteer',
      'FULL_TIME': 'full-time',
      'PART_TIME': 'part-time',
      'CONTRACT': 'contract',
      'TEMPORARY': 'temporary',
      'INTERNSHIP': 'internship'
    };
    
    return typeMap[linkedInType] || 'full-time';
  }

  /**
   * Extract country code from location string
   */
  private extractCountryCode(location?: string): string | undefined {
    if (!location) return undefined;
    
    // Simple country code extraction
    // In production, use a proper geocoding service
    const countryMap: Record<string, string> = {
      'United States': 'US',
      'United Kingdom': 'GB',
      'Canada': 'CA',
      'Germany': 'DE',
      'France': 'FR',
      'India': 'IN',
      'Australia': 'AU'
    };
    
    for (const [country, code] of Object.entries(countryMap)) {
      if (location.includes(country)) {
        return code;
      }
    }
    
    return undefined;
  }
}
