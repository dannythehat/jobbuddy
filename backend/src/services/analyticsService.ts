import { Op, QueryTypes } from 'sequelize';
import sequelize from '../config/database';
import { Application } from '../models/Application';
import { Response } from '../models/Response';
import { Interview } from '../models/Interview';
import { Job } from '../models/Job';
import { CV } from '../models/CV';

export interface AnalyticsData {
  overview: OverviewMetrics;
  trends: TrendData;
  performance: PerformanceMetrics;
  insights: InsightData[];
  recommendations: RecommendationData[];
  goals: GoalData;
  predictions: PredictionData;
}

export interface OverviewMetrics {
  totalApplications: number;
  responseRate: number;
  interviewRate: number;
  offerRate: number;
  acceptanceRate: number;
  averageResponseTime: number;
  activeApplications: number;
  thisMonthApplications: number;
  successScore: number;
}

export interface TrendData {
  applicationTrends: Array<{ date: string; count: number; responses: number; interviews: number }>;
  responseRateTrend: Array<{ date: string; rate: number }>;
  methodEffectiveness: Array<{ method: string; applications: number; responseRate: number; successRate: number }>;
  industryPerformance: Array<{ industry: string; applications: number; successRate: number }>;
  salaryTrends: Array<{ range: string; applications: number; successRate: number; avgOffer: number }>;
}

export interface PerformanceMetrics {
  bestPerformingMethods: Array<{ method: string; successRate: number; sampleSize: number }>;
  timeToResponse: { average: number; median: number; fastest: number; slowest: number };
  interviewConversionRate: number;
  offerConversionRate: number;
  skillsEffectiveness: Array<{ skill: string; demandScore: number; successRate: number }>;
  coverLetterPerformance: { aiGenerated: number; custom: number; template: number };
}

export interface InsightData {
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  data?: any;
}

export interface RecommendationData {
  category: 'application_strategy' | 'content_optimization' | 'timing' | 'targeting' | 'follow_up';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  expectedImpact: string;
  actionSteps: string[];
  confidence: number;
}

export interface GoalData {
  currentGoals: Array<{
    id: string;
    type: 'applications_per_week' | 'response_rate' | 'interview_rate' | 'offer_rate';
    target: number;
    current: number;
    progress: number;
    deadline: Date;
    status: 'on_track' | 'behind' | 'ahead' | 'completed';
  }>;
  suggestedGoals: Array<{
    type: string;
    target: number;
    reasoning: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }>;
}

export interface PredictionData {
  nextWeekApplications: number;
  expectedResponses: number;
  likelyInterviews: number;
  successProbability: number;
  timeToNextOffer: number;
  confidenceInterval: { min: number; max: number };
}

export class AnalyticsService {
  
  async getComprehensiveAnalytics(userId: string, timeRange: string = '6months'): Promise<AnalyticsData> {
    const dateFilter = this.getDateFilter(timeRange);
    
    const [overview, trends, performance, insights, recommendations, goals, predictions] = await Promise.all([
      this.getOverviewMetrics(userId, dateFilter),
      this.getTrendData(userId, dateFilter),
      this.getPerformanceMetrics(userId, dateFilter),
      this.generateInsights(userId, dateFilter),
      this.generateRecommendations(userId, dateFilter),
      this.getGoalData(userId),
      this.generatePredictions(userId, dateFilter)
    ]);

    return {
      overview,
      trends,
      performance,
      insights,
      recommendations,
      goals,
      predictions
    };
  }

  private async getOverviewMetrics(userId: string, dateFilter: any): Promise<OverviewMetrics> {
    const applications = await Application.findAll({
      where: { userId, ...dateFilter },
      include: [{ model: Response }, { model: Interview }]
    });

    const totalApplications = applications.length;
    const responsesReceived = applications.filter(app => app.responseType && app.responseType !== 'no_response').length;
    const interviewsScheduled = applications.filter(app => app.status === 'interviewing' || app.interviewDate).length;
    const offersReceived = applications.filter(app => app.status === 'offered').length;
    const acceptedOffers = applications.filter(app => app.status === 'accepted').length;

    const responseRate = totalApplications > 0 ? (responsesReceived / totalApplications) * 100 : 0;
    const interviewRate = totalApplications > 0 ? (interviewsScheduled / totalApplications) * 100 : 0;
    const offerRate = totalApplications > 0 ? (offersReceived / totalApplications) * 100 : 0;
    const acceptanceRate = offersReceived > 0 ? (acceptedOffers / offersReceived) * 100 : 0;

    // Calculate average response time
    const responseTimes = applications
      .filter(app => app.submissionDate && app.responseDate)
      .map(app => {
        const submission = new Date(app.submissionDate!);
        const response = new Date(app.responseDate!);
        return Math.abs(response.getTime() - submission.getTime()) / (1000 * 60 * 60 * 24); // days
      });

    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
      : 0;

    const activeApplications = applications.filter(app => 
      ['submitted', 'interviewing'].includes(app.status)
    ).length;

    const thisMonth = new Date();
    thisMonth.setDate(1);
    const thisMonthApplications = applications.filter(app => 
      app.createdAt >= thisMonth
    ).length;

    // Calculate success score (weighted metric)
    const successScore = Math.round(
      (responseRate * 0.3) + 
      (interviewRate * 0.4) + 
      (offerRate * 0.3)
    );

    return {
      totalApplications,
      responseRate: Math.round(responseRate * 100) / 100,
      interviewRate: Math.round(interviewRate * 100) / 100,
      offerRate: Math.round(offerRate * 100) / 100,
      acceptanceRate: Math.round(acceptanceRate * 100) / 100,
      averageResponseTime: Math.round(averageResponseTime * 10) / 10,
      activeApplications,
      thisMonthApplications,
      successScore
    };
  }

  private async getTrendData(userId: string, dateFilter: any): Promise<TrendData> {
    // Application trends over time
    const applicationTrends = await sequelize.query(`
      SELECT 
        DATE_TRUNC('week', created_at) as date,
        COUNT(*) as count,
        COUNT(CASE WHEN response_type IS NOT NULL AND response_type != 'no_response' THEN 1 END) as responses,
        COUNT(CASE WHEN status = 'interviewing' OR interview_date IS NOT NULL THEN 1 END) as interviews
      FROM applications 
      WHERE user_id = :userId AND created_at >= :startDate
      GROUP BY DATE_TRUNC('week', created_at)
      ORDER BY date
    `, {
      replacements: { userId, startDate: dateFilter.createdAt[Op.gte] },
      type: QueryTypes.SELECT
    }) as any[];

    // Response rate trend
    const responseRateTrend = applicationTrends.map(trend => ({
      date: trend.date,
      rate: trend.count > 0 ? (trend.responses / trend.count) * 100 : 0
    }));

    // Method effectiveness
    const methodEffectiveness = await sequelize.query(`
      SELECT 
        application_method as method,
        COUNT(*) as applications,
        (COUNT(CASE WHEN response_type IS NOT NULL AND response_type != 'no_response' THEN 1 END) * 100.0 / COUNT(*)) as response_rate,
        (COUNT(CASE WHEN status IN ('offered', 'accepted') THEN 1 END) * 100.0 / COUNT(*)) as success_rate
      FROM applications 
      WHERE user_id = :userId AND application_method IS NOT NULL
      GROUP BY application_method
      ORDER BY success_rate DESC
    `, {
      replacements: { userId },
      type: QueryTypes.SELECT
    }) as any[];

    // Industry performance (from job data)
    const industryPerformance = await sequelize.query(`
      SELECT 
        j.industry,
        COUNT(a.*) as applications,
        (COUNT(CASE WHEN a.status IN ('offered', 'accepted') THEN 1 END) * 100.0 / COUNT(a.*)) as success_rate
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.user_id = :userId AND j.industry IS NOT NULL
      GROUP BY j.industry
      HAVING COUNT(a.*) >= 2
      ORDER BY success_rate DESC
    `, {
      replacements: { userId },
      type: QueryTypes.SELECT
    }) as any[];

    // Salary trends
    const salaryTrends = await sequelize.query(`
      SELECT 
        CASE 
          WHEN j.salary_min < 50000 THEN '< $50K'
          WHEN j.salary_min < 75000 THEN '$50K - $75K'
          WHEN j.salary_min < 100000 THEN '$75K - $100K'
          WHEN j.salary_min < 150000 THEN '$100K - $150K'
          ELSE '$150K+'
        END as range,
        COUNT(a.*) as applications,
        (COUNT(CASE WHEN a.status IN ('offered', 'accepted') THEN 1 END) * 100.0 / COUNT(a.*)) as success_rate,
        AVG(a.salary_offered) as avg_offer
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.user_id = :userId AND j.salary_min IS NOT NULL
      GROUP BY range
      ORDER BY j.salary_min
    `, {
      replacements: { userId },
      type: QueryTypes.SELECT
    }) as any[];

    return {
      applicationTrends: applicationTrends.map(trend => ({
        date: trend.date,
        count: parseInt(trend.count),
        responses: parseInt(trend.responses),
        interviews: parseInt(trend.interviews)
      })),
      responseRateTrend,
      methodEffectiveness: methodEffectiveness.map(method => ({
        method: method.method,
        applications: parseInt(method.applications),
        responseRate: parseFloat(method.response_rate) || 0,
        successRate: parseFloat(method.success_rate) || 0
      })),
      industryPerformance: industryPerformance.map(industry => ({
        industry: industry.industry,
        applications: parseInt(industry.applications),
        successRate: parseFloat(industry.success_rate) || 0
      })),
      salaryTrends: salaryTrends.map(salary => ({
        range: salary.range,
        applications: parseInt(salary.applications),
        successRate: parseFloat(salary.success_rate) || 0,
        avgOffer: parseFloat(salary.avg_offer) || 0
      }))
    };
  }

  private async getPerformanceMetrics(userId: string, dateFilter: any): Promise<PerformanceMetrics> {
    const applications = await Application.findAll({
      where: { userId, ...dateFilter },
      include: [{ model: Job }]
    });

    // Best performing methods
    const methodStats = new Map();
    applications.forEach(app => {
      if (app.applicationMethod) {
        if (!methodStats.has(app.applicationMethod)) {
          methodStats.set(app.applicationMethod, { total: 0, success: 0 });
        }
        const stats = methodStats.get(app.applicationMethod);
        stats.total++;
        if (['offered', 'accepted'].includes(app.status)) {
          stats.success++;
        }
      }
    });

    const bestPerformingMethods = Array.from(methodStats.entries())
      .map(([method, stats]) => ({
        method,
        successRate: (stats.success / stats.total) * 100,
        sampleSize: stats.total
      }))
      .filter(method => method.sampleSize >= 3)
      .sort((a, b) => b.successRate - a.successRate);

    // Time to response calculations
    const responseTimes = applications
      .filter(app => app.submissionDate && app.responseDate)
      .map(app => {
        const submission = new Date(app.submissionDate!);
        const response = new Date(app.responseDate!);
        return Math.abs(response.getTime() - submission.getTime()) / (1000 * 60 * 60 * 24);
      })
      .sort((a, b) => a - b);

    const timeToResponse = {
      average: responseTimes.length > 0 ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length : 0,
      median: responseTimes.length > 0 ? responseTimes[Math.floor(responseTimes.length / 2)] : 0,
      fastest: responseTimes.length > 0 ? responseTimes[0] : 0,
      slowest: responseTimes.length > 0 ? responseTimes[responseTimes.length - 1] : 0
    };

    // Conversion rates
    const interviewApplications = applications.filter(app => ['interviewing', 'offered', 'accepted'].includes(app.status));
    const offerApplications = applications.filter(app => ['offered', 'accepted'].includes(app.status));
    
    const interviewConversionRate = applications.length > 0 ? (interviewApplications.length / applications.length) * 100 : 0;
    const offerConversionRate = interviewApplications.length > 0 ? (offerApplications.length / interviewApplications.length) * 100 : 0;

    // Mock data for skills effectiveness and cover letter performance
    const skillsEffectiveness = [
      { skill: 'React', demandScore: 95, successRate: 78 },
      { skill: 'TypeScript', demandScore: 88, successRate: 82 },
      { skill: 'Node.js', demandScore: 85, successRate: 75 },
      { skill: 'Python', demandScore: 92, successRate: 80 },
      { skill: 'AWS', demandScore: 90, successRate: 85 }
    ];

    const coverLetterPerformance = {
      aiGenerated: 75,
      custom: 82,
      template: 65
    };

    return {
      bestPerformingMethods,
      timeToResponse,
      interviewConversionRate: Math.round(interviewConversionRate * 100) / 100,
      offerConversionRate: Math.round(offerConversionRate * 100) / 100,
      skillsEffectiveness,
      coverLetterPerformance
    };
  }

  private async generateInsights(userId: string, dateFilter: any): Promise<InsightData[]> {
    const insights: InsightData[] = [];
    const applications = await Application.findAll({ where: { userId, ...dateFilter } });

    // Response rate insight
    const responseRate = applications.filter(app => app.responseType && app.responseType !== 'no_response').length / applications.length * 100;
    if (responseRate < 20) {
      insights.push({
        type: 'warning',
        title: 'Low Response Rate',
        description: `Your response rate of ${responseRate.toFixed(1)}% is below industry average (25-30%). Consider optimizing your application strategy.`,
        impact: 'high',
        actionable: true,
        data: { currentRate: responseRate, targetRate: 25 }
      });
    } else if (responseRate > 40) {
      insights.push({
        type: 'success',
        title: 'Excellent Response Rate',
        description: `Your response rate of ${responseRate.toFixed(1)}% is well above industry average. Keep up the great work!`,
        impact: 'high',
        actionable: false,
        data: { currentRate: responseRate }
      });
    }

    // Application frequency insight
    const recentApplications = applications.filter(app => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return app.createdAt >= weekAgo;
    }).length;

    if (recentApplications < 3) {
      insights.push({
        type: 'info',
        title: 'Increase Application Frequency',
        description: `You've submitted ${recentApplications} applications this week. Consider increasing to 5-10 per week for better results.`,
        impact: 'medium',
        actionable: true,
        data: { currentWeekly: recentApplications, suggestedWeekly: 7 }
      });
    }

    // Method effectiveness insight
    const methodStats = new Map();
    applications.forEach(app => {
      if (app.applicationMethod) {
        if (!methodStats.has(app.applicationMethod)) {
          methodStats.set(app.applicationMethod, { total: 0, responses: 0 });
        }
        const stats = methodStats.get(app.applicationMethod);
        stats.total++;
        if (app.responseType && app.responseType !== 'no_response') {
          stats.responses++;
        }
      }
    });

    const bestMethod = Array.from(methodStats.entries())
      .map(([method, stats]) => ({ method, rate: stats.responses / stats.total }))
      .sort((a, b) => b.rate - a.rate)[0];

    if (bestMethod && bestMethod.rate > 0.3) {
      insights.push({
        type: 'success',
        title: 'Effective Application Method',
        description: `${bestMethod.method} applications have a ${(bestMethod.rate * 100).toFixed(1)}% response rate. Focus more on this channel.`,
        impact: 'medium',
        actionable: true,
        data: { method: bestMethod.method, rate: bestMethod.rate }
      });
    }

    return insights;
  }

  private async generateRecommendations(userId: string, dateFilter: any): Promise<RecommendationData[]> {
    const recommendations: RecommendationData[] = [];
    const applications = await Application.findAll({ where: { userId, ...dateFilter } });

    // Application strategy recommendations
    const responseRate = applications.filter(app => app.responseType && app.responseType !== 'no_response').length / applications.length * 100;
    
    if (responseRate < 25) {
      recommendations.push({
        category: 'application_strategy',
        priority: 'high',
        title: 'Optimize Application Targeting',
        description: 'Your response rate suggests applications may not be well-targeted to your profile.',
        expectedImpact: 'Increase response rate by 10-15%',
        actionSteps: [
          'Review job requirements more carefully before applying',
          'Focus on positions that match 70%+ of your skills',
          'Research company culture and values alignment',
          'Customize applications for each specific role'
        ],
        confidence: 85
      });
    }

    // Content optimization
    const aiGeneratedApps = applications.filter(app => app.coverLetter?.includes('AI-generated')).length;
    if (aiGeneratedApps / applications.length > 0.8) {
      recommendations.push({
        category: 'content_optimization',
        priority: 'medium',
        title: 'Add Personal Touch to Applications',
        description: 'While AI-generated content is efficient, adding personal elements can improve success rates.',
        expectedImpact: 'Increase interview rate by 5-8%',
        actionSteps: [
          'Add 1-2 personal sentences to each cover letter',
          'Include specific company research insights',
          'Mention relevant personal projects or experiences',
          'Customize the opening and closing paragraphs'
        ],
        confidence: 70
      });
    }

    // Timing recommendations
    const applicationsByDay = new Map();
    applications.forEach(app => {
      const day = app.createdAt.getDay();
      applicationsByDay.set(day, (applicationsByDay.get(day) || 0) + 1);
    });

    const weekendApplications = (applicationsByDay.get(0) || 0) + (applicationsByDay.get(6) || 0);
    if (weekendApplications / applications.length > 0.3) {
      recommendations.push({
        category: 'timing',
        priority: 'low',
        title: 'Optimize Application Timing',
        description: 'Applications submitted on weekdays typically receive faster responses.',
        expectedImpact: 'Reduce response time by 1-2 days',
        actionSteps: [
          'Submit applications Tuesday-Thursday for best results',
          'Avoid Monday mornings and Friday afternoons',
          'Consider time zones for remote positions',
          'Schedule applications during business hours'
        ],
        confidence: 60
      });
    }

    // Follow-up recommendations
    const appsWithoutFollowUp = applications.filter(app => 
      app.status === 'submitted' && 
      !app.followUpDates?.length &&
      app.submissionDate &&
      new Date().getTime() - app.submissionDate.getTime() > 7 * 24 * 60 * 60 * 1000
    ).length;

    if (appsWithoutFollowUp > 5) {
      recommendations.push({
        category: 'follow_up',
        priority: 'medium',
        title: 'Implement Follow-up Strategy',
        description: `You have ${appsWithoutFollowUp} applications without follow-ups. Strategic follow-ups can increase response rates.`,
        expectedImpact: 'Increase response rate by 8-12%',
        actionSteps: [
          'Send polite follow-up after 1 week of no response',
          'Include additional relevant information or portfolio updates',
          'Express continued interest and enthusiasm',
          'Limit to one follow-up per application unless invited to continue'
        ],
        confidence: 75
      });
    }

    return recommendations;
  }

  private async getGoalData(userId: string): Promise<GoalData> {
    // Mock goal data - in real implementation, this would come from a Goals model
    const currentGoals = [
      {
        id: '1',
        type: 'applications_per_week' as const,
        target: 10,
        current: 7,
        progress: 70,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'on_track' as const
      },
      {
        id: '2',
        type: 'response_rate' as const,
        target: 30,
        current: 22,
        progress: 73,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'behind' as const
      }
    ];

    const suggestedGoals = [
      {
        type: 'interview_rate',
        target: 15,
        reasoning: 'Based on your current response rate, aiming for 15% interview rate is achievable',
        difficulty: 'medium' as const
      },
      {
        type: 'offer_rate',
        target: 5,
        reasoning: 'Industry average for your skill level and experience',
        difficulty: 'hard' as const
      }
    ];

    return { currentGoals, suggestedGoals };
  }

  private async generatePredictions(userId: string, dateFilter: any): Promise<PredictionData> {
    const applications = await Application.findAll({ where: { userId, ...dateFilter } });
    
    // Simple prediction based on historical data
    const weeklyAverage = applications.length / 26; // Assuming 6 months = 26 weeks
    const responseRate = applications.filter(app => app.responseType && app.responseType !== 'no_response').length / applications.length;
    const interviewRate = applications.filter(app => ['interviewing', 'offered', 'accepted'].includes(app.status)).length / applications.length;

    const nextWeekApplications = Math.round(weeklyAverage);
    const expectedResponses = Math.round(nextWeekApplications * responseRate);
    const likelyInterviews = Math.round(nextWeekApplications * interviewRate);
    
    // Success probability based on current trends
    const recentSuccess = applications.slice(-10).filter(app => ['offered', 'accepted'].includes(app.status)).length / 10;
    const successProbability = Math.min(recentSuccess * 100, 95);

    // Time to next offer (in days)
    const offerRate = applications.filter(app => ['offered', 'accepted'].includes(app.status)).length / applications.length;
    const timeToNextOffer = offerRate > 0 ? Math.round(7 / (weeklyAverage * offerRate)) : 60;

    return {
      nextWeekApplications,
      expectedResponses,
      likelyInterviews,
      successProbability: Math.round(successProbability * 100) / 100,
      timeToNextOffer,
      confidenceInterval: {
        min: Math.max(0, successProbability - 15),
        max: Math.min(100, successProbability + 15)
      }
    };
  }

  private getDateFilter(timeRange: string) {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case '1month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case '3months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case '6months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        break;
      case '1year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    }

    return {
      createdAt: {
        [Op.gte]: startDate
      }
    };
  }
}

export const analyticsService = new AnalyticsService();