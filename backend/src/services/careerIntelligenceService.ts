import OpenAI from 'openai';
import { logger } from '../config/logger';

interface CareerPath {
  currentRole: string;
  targetRole: string;
  steps: CareerStep[];
  timeframe: string;
  salaryProgression: { role: string; salary: number }[];
}

interface CareerStep {
  role: string;
  skills: string[];
  experience: string;
  certifications?: string[];
  estimatedTime: string;
}

interface SkillGap {
  skill: string;
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  requiredLevel: 'beginner' | 'intermediate' | 'advanced';
  priority: 'high' | 'medium' | 'low';
  learningResources: string[];
}

export class CareerIntelligenceService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateCareerPath(
    currentRole: string,
    targetRole: string,
    currentSkills: string[],
    experience: number
  ): Promise<CareerPath> {
    try {
      const prompt = `
        Create a career progression path:
        
        Current: ${currentRole} (${experience} years experience)
        Target: ${targetRole}
        Current Skills: ${currentSkills.join(', ')}
        
        Provide:
        1. Step-by-step career progression
        2. Skills needed for each step
        3. Estimated timeframes
        4. Salary progression estimates
        5. Recommended certifications
        
        Return as structured JSON.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 1500
      });

      const careerPath = JSON.parse(response.choices[0].message.content || '{}');
      return careerPath;
    } catch (error) {
      logger.error('Career path generation error:', error);
      throw error;
    }
  }

  async analyzeSkillGaps(
    currentSkills: string[],
    targetRole: string
  ): Promise<SkillGap[]> {
    try {
      const prompt = `
        Analyze skill gaps for career transition:
        
        Current Skills: ${currentSkills.join(', ')}
        Target Role: ${targetRole}
        
        For each missing/weak skill, provide:
        1. Skill name
        2. Current level assessment
        3. Required level for target role
        4. Priority (high/medium/low)
        5. Learning resources (courses, books, projects)
        
        Return as JSON array.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1000
      });

      const skillGaps = JSON.parse(response.choices[0].message.content || '[]');
      return skillGaps;
    } catch (error) {
      logger.error('Skill gap analysis error:', error);
      throw error;
    }
  }

  async getMarketInsights(role: string, location?: string): Promise<any> {
    try {
      const prompt = `
        Provide current market insights for ${role}${location ? ` in ${location}` : ''}:
        
        Include:
        1. Average salary ranges
        2. Job market demand (high/medium/low)
        3. Growth trends
        4. Top skills in demand
        5. Major hiring companies
        6. Remote work availability
        
        Return as structured JSON.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 800
      });

      const insights = JSON.parse(response.choices[0].message.content || '{}');
      return insights;
    } catch (error) {
      logger.error('Market insights error:', error);
      throw error;
    }
  }
}