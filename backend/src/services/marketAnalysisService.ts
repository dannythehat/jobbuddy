import OpenAI from 'openai';
import { logger } from '../config/logger';

interface MarketTrend {
  skill: string;
  demand: 'high' | 'medium' | 'low';
  growth: number;
  salaryTrend: 'increasing' | 'stable' | 'decreasing';
  avgSalary: { min: number; max: number };
  topCompanies: string[];
  emergingTechnologies: string[];
}

interface JobMarketAlert {
  id: string;
  userId: string;
  type: 'salary_increase' | 'demand_spike' | 'new_opportunity' | 'skill_trending';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  createdAt: Date;
}

export class MarketAnalysisService {
  private openai: OpenAI;
  private alerts: Map<string, JobMarketAlert[]> = new Map();

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async analyzeMarketTrends(
    skills: string[],
    location?: string,
    industry?: string
  ): Promise<MarketTrend[]> {
    try {
      const prompt = `
        Analyze current job market trends for:
        
        Skills: ${skills.join(', ')}
        Location: ${location || 'Global'}
        Industry: ${industry || 'All'}
        
        For each skill, provide:
        1. Current demand level (high/medium/low)
        2. Growth percentage over last year
        3. Salary trends and ranges
        4. Top hiring companies
        5. Emerging related technologies
        
        Return as JSON array with realistic market data.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 1200
      });

      const trends = JSON.parse(response.choices[0].message.content || '[]');
      return trends;
    } catch (error) {
      logger.error('Market trend analysis error:', error);
      throw error;
    }
  }

  async generatePersonalizedAlerts(
    userId: string,
    userSkills: string[],
    careerGoals: string[],
    preferences: { location?: string; salary?: number; remote?: boolean }
  ): Promise<JobMarketAlert[]> {
    try {
      const prompt = `
        Generate personalized job market alerts for:
        
        Skills: ${userSkills.join(', ')}
        Career Goals: ${careerGoals.join(', ')}
        Preferences: ${JSON.stringify(preferences)}
        
        Create 3-5 relevant alerts about:
        1. Salary increases in their field
        2. Demand spikes for their skills
        3. New opportunities matching goals
        4. Trending skills they should learn
        
        Return as JSON array with actionable insights.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 1000
      });

      const alertsData = JSON.parse(response.choices[0].message.content || '[]');
      
      const alerts: JobMarketAlert[] = alertsData.map((alert: any, index: number) => ({
        id: `alert_${Date.now()}_${index}`,
        userId,
        type: alert.type,
        title: alert.title,
        description: alert.description,
        priority: alert.priority,
        actionable: alert.actionable || true,
        createdAt: new Date()
      }));

      // Store alerts for user
      this.alerts.set(userId, alerts);
      
      return alerts;
    } catch (error) {
      logger.error('Alert generation error:', error);
      throw error;
    }
  }

  async predictSalaryTrends(
    role: string,
    location: string,
    experience: number
  ): Promise<any> {
    try {
      const prompt = `
        Predict salary trends for:
        
        Role: ${role}
        Location: ${location}
        Experience: ${experience} years
        
        Provide:
        1. Current salary range
        2. 1-year projection
        3. 3-year projection
        4. Factors affecting growth
        5. Recommendations for salary optimization
        
        Return as structured JSON.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 800
      });

      const prediction = JSON.parse(response.choices[0].message.content || '{}');
      return prediction;
    } catch (error) {
      logger.error('Salary prediction error:', error);
      throw error;
    }
  }
}