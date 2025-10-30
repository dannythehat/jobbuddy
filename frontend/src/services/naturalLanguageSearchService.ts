const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface NaturalLanguageQuery {
  query: string;
}

export interface ParsedQuery {
  originalQuery: string;
  parsedCriteria: {
    title?: string;
    location?: string;
    jobType?: string;
    experienceLevel?: string;
    skills?: string[];
    salaryMin?: number;
    salaryMax?: number;
    remote?: boolean;
  };
  confidence: number;
}

export interface JobSearchResult {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    jobType: string;
    salaryMin?: number;
    salaryMax?: number;
    salaryCurrency?: string;
    description: string;
    requiredSkills?: string[];
    experienceLevel?: string;
    postedDate: string;
    applicationUrl: string;
    status: string;
  };
  score: number;
  matchReasons: string[];
}

export interface SearchSuggestion {
  category: string;
  examples: string[];
}

class NaturalLanguageSearchService {
  private async fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Natural Language Search API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  }

  async searchJobs(query: string): Promise<JobSearchResult[]> {
    return this.fetchWithAuth('/nl/search/natural', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }

  async parseQuery(query: string): Promise<ParsedQuery> {
    return this.fetchWithAuth('/nl/search/parse', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }

  async getSuggestions(): Promise<SearchSuggestion[]> {
    return this.fetchWithAuth('/nl/search/suggestions');
  }
}

export const naturalLanguageSearchService = new NaturalLanguageSearchService();
