import OpenAI from 'openai';
import { logger } from '../config/logger';

interface LearningResource {
  id: string;
  title: string;
  type: 'course' | 'book' | 'tutorial' | 'project' | 'certification';
  provider: string;
  url?: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  price: 'free' | 'paid' | number;
  skills: string[];
}

interface LearningPath {
  id: string;
  skill: string;
  currentLevel: string;
  targetLevel: string;
  estimatedTime: string;
  resources: LearningResource[];
  milestones: string[];
  prerequisites: string[];
}

interface SkillAssessment {
  skill: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  confidence: number;
  evidence: string[];
  recommendations: string[];
}

export class LearningService {
  private openai: OpenAI;
  private assessments: Map<string, SkillAssessment[]> = new Map();

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateLearningPath(
    skill: string,
    currentLevel: string,
    targetLevel: string,
    timeframe?: string
  ): Promise<LearningPath> {
    try {
      const prompt = `
        Create a comprehensive learning path for:
        
        Skill: ${skill}
        Current Level: ${currentLevel}
        Target Level: ${targetLevel}
        Timeframe: ${timeframe || 'flexible'}
        
        Provide:
        1. Structured learning resources (courses, books, projects)
        2. Learning milestones and checkpoints
        3. Prerequisites and dependencies
        4. Estimated time for each resource
        5. Mix of free and paid resources
        6. Practical projects to build
        
        Return as structured JSON with realistic resources.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 1500
      });

      const pathData = JSON.parse(response.choices[0].message.content || '{}');
      
      const learningPath: LearningPath = {
        id: `path_${Date.now()}`,
        skill,
        currentLevel,
        targetLevel,
        estimatedTime: pathData.estimatedTime || '3-6 months',
        resources: pathData.resources || [],
        milestones: pathData.milestones || [],
        prerequisites: pathData.prerequisites || []
      };

      return learningPath;
    } catch (error) {
      logger.error('Learning path generation error:', error);
      throw error;
    }
  }

  async assessSkills(
    userId: string,
    skills: string[],
    experience: string,
    projects: string[]
  ): Promise<SkillAssessment[]> {
    try {
      const prompt = `
        Assess skill levels based on:
        
        Skills to assess: ${skills.join(', ')}
        Experience: ${experience}
        Projects: ${projects.join(', ')}
        
        For each skill, provide:
        1. Estimated level (beginner/intermediate/advanced)
        2. Confidence score (0-100)
        3. Evidence supporting the assessment
        4. Specific recommendations for improvement
        
        Return as JSON array.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 1200
      });

      const assessments = JSON.parse(response.choices[0].message.content || '[]');
      
      // Store assessments for user
      this.assessments.set(userId, assessments);
      
      return assessments;
    } catch (error) {
      logger.error('Skill assessment error:', error);
      throw error;
    }
  }

  async recommendResources(
    skill: string,
    level: string,
    learningStyle?: string
  ): Promise<LearningResource[]> {
    try {
      const prompt = `
        Recommend learning resources for:
        
        Skill: ${skill}
        Level: ${level}
        Learning Style: ${learningStyle || 'mixed'}
        
        Provide 5-8 high-quality resources including:
        1. Online courses (Coursera, Udemy, Pluralsight)
        2. Books and documentation
        3. Hands-on projects
        4. Certifications
        5. Free tutorials and guides
        
        Include realistic details: provider, duration, difficulty, rating.
        Return as JSON array.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1000
      });

      const resources = JSON.parse(response.choices[0].message.content || '[]');
      return resources;
    } catch (error) {
      logger.error('Resource recommendation error:', error);
      throw error;
    }
  }

  async trackProgress(
    userId: string,
    skill: string,
    completedResources: string[],
    timeSpent: number
  ): Promise<{ progress: number; nextSteps: string[]; achievements: string[] }> {
    try {
      const userAssessments = this.assessments.get(userId) || [];
      const skillAssessment = userAssessments.find(a => a.skill === skill);
      
      if (!skillAssessment) {
        throw new Error('Skill assessment not found');
      }

      const prompt = `
        Calculate learning progress for:
        
        Skill: ${skill}
        Current Level: ${skillAssessment.level}
        Completed Resources: ${completedResources.join(', ')}
        Time Spent: ${timeSpent} hours
        
        Provide:
        1. Progress percentage (0-100)
        2. Next recommended steps
        3. Achievements unlocked
        4. Areas needing more focus
        
        Return as JSON.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 600
      });

      const progress = JSON.parse(response.choices[0].message.content || '{}');
      return progress;
    } catch (error) {
      logger.error('Progress tracking error:', error);
      throw error;
    }
  }
}