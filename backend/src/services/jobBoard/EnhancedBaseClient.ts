// Phase 7.1.1: Enhanced Base Job Board Client with Rate Limiting & Retry Logic
import { JobBoardJob, JobBoardSearchParams } from '../../types/jobBoard';

interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

interface RateLimitConfig {
  maxRequestsPerMinute: number;
  maxRequestsPerHour: number;
}

export abstract class EnhancedBaseJobBoardClient {
  protected baseUrl: string;
  protected providerName: string;
  protected retryConfig: RetryConfig;
  protected rateLimitConfig: RateLimitConfig;
  private requestTimestamps: number[] = [];

  constructor(
    baseUrl: string,
    providerName: string,
    rateLimitConfig?: Partial<RateLimitConfig>
  ) {
    this.baseUrl = baseUrl;
    this.providerName = providerName;
    this.retryConfig = {
      maxRetries: 3,
      initialDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2
    };
    this.rateLimitConfig = {
      maxRequestsPerMinute: rateLimitConfig?.maxRequestsPerMinute || 60,
      maxRequestsPerHour: rateLimitConfig?.maxRequestsPerHour || 1000
    };
  }

  abstract fetchJobs(params: JobBoardSearchParams, accessToken: string): Promise<JobBoardJob[]>;
  abstract getJobDetails(jobId: string, accessToken: string): Promise<JobBoardJob | null>;
  abstract validateToken(accessToken: string): Promise<boolean>;

  /**
   * Rate-limited request with retry logic
   */
  protected async makeRequestWithRetry<T>(
    endpoint: string,
    accessToken: string,
    options: RequestInit = {}
  ): Promise<T> {
    await this.enforceRateLimit();

    let lastError: Error | null = null;
    let delay = this.retryConfig.initialDelay;

    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        return await this.makeRequest<T>(endpoint, accessToken, options);
      } catch (error: any) {
        lastError = error;

        if (!this.isRetryableError(error) || attempt === this.retryConfig.maxRetries) {
          throw error;
        }

        await this.sleep(delay);
        delay = Math.min(delay * this.retryConfig.backoffMultiplier, this.retryConfig.maxDelay);
      }
    }

    throw lastError;
  }

  private async makeRequest<T>(
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

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const oneHourAgo = now - 3600000;

    this.requestTimestamps = this.requestTimestamps.filter(ts => ts > oneHourAgo);

    const recentMinute = this.requestTimestamps.filter(ts => ts > oneMinuteAgo).length;
    const recentHour = this.requestTimestamps.length;

    if (recentMinute >= this.rateLimitConfig.maxRequestsPerMinute) {
      await this.sleep(60000 - (now - this.requestTimestamps[0]));
    }

    if (recentHour >= this.rateLimitConfig.maxRequestsPerHour) {
      await this.sleep(3600000 - (now - this.requestTimestamps[0]));
    }

    this.requestTimestamps.push(now);
  }

  private isRetryableError(error: any): boolean {
    const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
    const statusMatch = error.message?.match(/error: (\d+)/);
    if (statusMatch) {
      const statusCode = parseInt(statusMatch[1]);
      return retryableStatusCodes.includes(statusCode);
    }
    return false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
