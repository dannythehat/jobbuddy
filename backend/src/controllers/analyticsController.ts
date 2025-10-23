import { Request, Response } from 'express';
import { analyticsService } from '../services/analyticsService';

export class AnalyticsController {
  
  async getAnalytics(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const timeRange = req.query.timeRange as string || '6months';
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const analytics = await analyticsService.getComprehensiveAnalytics(userId, timeRange);
      
      res.json({
        success: true,
        data: analytics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ 
        error: 'Failed to fetch analytics data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getOverview(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const timeRange = req.query.timeRange as string || '6months';
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const analytics = await analyticsService.getComprehensiveAnalytics(userId, timeRange);
      
      res.json({
        success: true,
        data: {
          overview: analytics.overview,
          goals: analytics.goals,
          predictions: analytics.predictions
        }
      });
    } catch (error) {
      console.error('Error fetching overview:', error);
      res.status(500).json({ 
        error: 'Failed to fetch overview data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getTrends(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const timeRange = req.query.timeRange as string || '6months';
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const analytics = await analyticsService.getComprehensiveAnalytics(userId, timeRange);
      
      res.json({
        success: true,
        data: analytics.trends
      });
    } catch (error) {
      console.error('Error fetching trends:', error);
      res.status(500).json({ 
        error: 'Failed to fetch trends data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getPerformance(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const timeRange = req.query.timeRange as string || '6months';
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const analytics = await analyticsService.getComprehensiveAnalytics(userId, timeRange);
      
      res.json({
        success: true,
        data: analytics.performance
      });
    } catch (error) {
      console.error('Error fetching performance:', error);
      res.status(500).json({ 
        error: 'Failed to fetch performance data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getInsights(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const timeRange = req.query.timeRange as string || '6months';
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const analytics = await analyticsService.getComprehensiveAnalytics(userId, timeRange);
      
      res.json({
        success: true,
        data: {
          insights: analytics.insights,
          recommendations: analytics.recommendations
        }
      });
    } catch (error) {
      console.error('Error fetching insights:', error);
      res.status(500).json({ 
        error: 'Failed to fetch insights data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getRecommendations(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const timeRange = req.query.timeRange as string || '6months';
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const analytics = await analyticsService.getComprehensiveAnalytics(userId, timeRange);
      
      res.json({
        success: true,
        data: analytics.recommendations
      });
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      res.status(500).json({ 
        error: 'Failed to fetch recommendations data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async exportAnalytics(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const timeRange = req.query.timeRange as string || '6months';
      const format = req.query.format as string || 'json';
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const analytics = await analyticsService.getComprehensiveAnalytics(userId, timeRange);
      
      if (format === 'csv') {
        // Convert to CSV format
        const csvData = this.convertToCSV(analytics);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="jobbuddy-analytics-${timeRange}.csv"`);
        res.send(csvData);
      } else {
        // JSON format
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="jobbuddy-analytics-${timeRange}.json"`);
        res.json(analytics);
      }
    } catch (error) {
      console.error('Error exporting analytics:', error);
      res.status(500).json({ 
        error: 'Failed to export analytics data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private convertToCSV(analytics: any): string {
    const headers = [
      'Metric',
      'Value',
      'Category',
      'Date'
    ];

    const rows = [
      ['Total Applications', analytics.overview.totalApplications, 'Overview', new Date().toISOString()],
      ['Response Rate', `${analytics.overview.responseRate}%`, 'Overview', new Date().toISOString()],
      ['Interview Rate', `${analytics.overview.interviewRate}%`, 'Overview', new Date().toISOString()],
      ['Offer Rate', `${analytics.overview.offerRate}%`, 'Overview', new Date().toISOString()],
      ['Success Score', analytics.overview.successScore, 'Overview', new Date().toISOString()],
      ['Average Response Time', `${analytics.overview.averageResponseTime} days`, 'Performance', new Date().toISOString()],
      ['Interview Conversion Rate', `${analytics.performance.interviewConversionRate}%`, 'Performance', new Date().toISOString()],
      ['Offer Conversion Rate', `${analytics.performance.offerConversionRate}%`, 'Performance', new Date().toISOString()]
    ];

    // Add method effectiveness data
    analytics.trends.methodEffectiveness.forEach((method: any) => {
      rows.push([
        `${method.method} Success Rate`,
        `${method.successRate}%`,
        'Method Effectiveness',
        new Date().toISOString()
      ]);
    });

    // Add industry performance data
    analytics.trends.industryPerformance.forEach((industry: any) => {
      rows.push([
        `${industry.industry} Success Rate`,
        `${industry.successRate}%`,
        'Industry Performance',
        new Date().toISOString()
      ]);
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
  }
}

export const analyticsController = new AnalyticsController();