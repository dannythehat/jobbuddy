const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface DashboardAnalytics {
  overview: {
    totalApplications: number;
    interviewsScheduled: number;
    responseRate: number;
    averageResponseTime: string;
  };
  applications: {
    thisWeek: number;
    thisMonth: number;
    pending: number;
    interviews: number;
    offers: number;
    rejections: number;
  };
  jobMatching: {
    matchAccuracy: number;
    skillsMatched: number;
    totalSkills: number;
    topMatchedRoles: string[];
  };
  automation: {
    emailsProcessed: number;
    autoResponses: number;
    interviewsScheduled: number;
    timesSaved: string;
  };
  trends: {
    applicationTrend: Array<{ date: string; count: number }>;
    responseRates: Array<{ company: string; rate: number }>;
  };
}

export interface ApplicationAnalytics {
  summary: {
    total: number;
    successful: number;
    pending: number;
    rejected: number;
    interviews: number;
  };
  byStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  byCompany: Array<{
    company: string;
    applications: number;
    interviews: number;
    offers: number;
  }>;
  timeline: any[];
}

export interface SkillsAnalytics {
  topSkills: Array<{
    skill: string;
    demand: number;
    userLevel: number;
  }>;
  skillGaps: Array<{
    skill: string;
    demand: number;
    userLevel: number;
  }>;
  recommendations: string[];
}

export interface PerformanceAnalytics {
  efficiency: {
    averageApplicationTime: string;
    manualApplicationTime: string;
    timeSaved: string;
  };
  success: {
    responseRate: number;
    interviewRate: number;
    offerRate: number;
    industryAverage: {
      responseRate: number;
      interviewRate: number;
      offerRate: number;
    };
  };
  automation: {
    emailsClassified: number;
    accuracyRate: number;
    interviewsAutoScheduled: number;
    responsesGenerated: number;
  };
}

class AnalyticsService {
  private async fetchWithAuth(endpoint: string): Promise<any> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Analytics API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  }

  async getDashboardAnalytics(): Promise<DashboardAnalytics> {
    return this.fetchWithAuth('/analytics/dashboard');
  }

  async getApplicationAnalytics(period: string = '30d'): Promise<ApplicationAnalytics> {
    return this.fetchWithAuth(`/analytics/applications?period=${period}`);
  }

  async getSkillsAnalytics(): Promise<SkillsAnalytics> {
    return this.fetchWithAuth('/analytics/skills');
  }

  async getPerformanceAnalytics(): Promise<PerformanceAnalytics> {
    return this.fetchWithAuth('/analytics/performance');
  }
}

export const analyticsService = new AnalyticsService();