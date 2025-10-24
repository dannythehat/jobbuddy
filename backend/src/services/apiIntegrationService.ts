import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

interface APIConfig {
  baseURL: string;
  apiKey?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

/**
 * Universal API Integration Service
 * Provides a unified interface for connecting to external APIs
 */
export class APIIntegrationService {
  private clients: Map<string, AxiosInstance> = new Map();

  /**
   * Register a new API client
   */
  registerAPI(name: string, config: APIConfig): void {
    const client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` }),
        ...config.headers
      }
    });

    // Add request interceptor for logging
    client.interceptors.request.use(
      (config) => {
        console.log(`[${name}] API Request:`, config.method?.toUpperCase(), config.url);
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error(`[${name}] API Error:`, error.response?.status, error.message);
        return Promise.reject(error);
      }
    );

    this.clients.set(name, client);
  }

  /**
   * Make API request
   */
  async request<T = any>(
    apiName: string, 
    endpoint: string, 
    options: AxiosRequestConfig = {}
  ): Promise<APIResponse<T>> {
    try {
      const client = this.clients.get(apiName);
      if (!client) {
        throw new Error(`API client '${apiName}' not registered`);
      }

      const response = await client.request({
        url: endpoint,
        ...options
      });

      return {
        success: true,
        data: response.data,
        statusCode: response.status
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        statusCode: error.response?.status || 500
      };
    }
  }

  /**
   * GET request
   */
  async get<T = any>(apiName: string, endpoint: string, params?: any): Promise<APIResponse<T>> {
    return this.request<T>(apiName, endpoint, { method: 'GET', params });
  }

  /**
   * POST request
   */
  async post<T = any>(apiName: string, endpoint: string, data?: any): Promise<APIResponse<T>> {
    return this.request<T>(apiName, endpoint, { method: 'POST', data });
  }

  /**
   * PUT request
   */
  async put<T = any>(apiName: string, endpoint: string, data?: any): Promise<APIResponse<T>> {
    return this.request<T>(apiName, endpoint, { method: 'PUT', data });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(apiName: string, endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(apiName, endpoint, { method: 'DELETE' });
  }

  /**
   * Check if API is registered
   */
  hasAPI(name: string): boolean {
    return this.clients.has(name);
  }

  /**
   * Get list of registered APIs
   */
  getRegisteredAPIs(): string[] {
    return Array.from(this.clients.keys());
  }
}

// Create singleton instance
export const apiService = new APIIntegrationService();

// Pre-configure common job board APIs
export const initializeJobAPIs = () => {
  // LinkedIn Jobs API (example configuration)
  apiService.registerAPI('linkedin', {
    baseURL: 'https://api.linkedin.com/v2',
    headers: {
      'X-Restli-Protocol-Version': '2.0.0'
    }
  });

  // Indeed API (example configuration)
  apiService.registerAPI('indeed', {
    baseURL: 'https://api.indeed.com/ads',
    timeout: 15000
  });

  // Glassdoor API (example configuration)
  apiService.registerAPI('glassdoor', {
    baseURL: 'https://api.glassdoor.com/api',
    timeout: 12000
  });

  // Google Jobs API (example configuration)
  apiService.registerAPI('google-jobs', {
    baseURL: 'https://jobs.googleapis.com/v4',
    timeout: 10000
  });

  // OpenAI API for AI features
  apiService.registerAPI('openai', {
    baseURL: 'https://api.openai.com/v1',
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30000
  });

  // Google Calendar API
  apiService.registerAPI('google-calendar', {
    baseURL: 'https://www.googleapis.com/calendar/v3',
    timeout: 10000
  });

  // Gmail API for email processing
  apiService.registerAPI('gmail', {
    baseURL: 'https://www.googleapis.com/gmail/v1',
    timeout: 15000
  });
};

export default apiService;