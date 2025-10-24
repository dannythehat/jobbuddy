import { Request, Response } from 'express';
import { NLPService } from '../services/nlpService';
import { InterviewPrepService } from '../services/interviewPrepService';
import { CareerIntelligenceService } from '../services/careerIntelligenceService';
import { LearningService } from '../services/learningService';
import { MarketAnalysisService } from '../services/marketAnalysisService';
import { logger } from '../config/logger';

export class EnhancedAIController {
  private nlpService: NLPService;
  private interviewService: InterviewPrepService;
  private careerService: CareerIntelligenceService;
  private learningService: LearningService;
  private marketService: MarketAnalysisService;

  constructor() {
    this.nlpService = new NLPService();
    this.interviewService = new InterviewPrepService();
    this.careerService = new CareerIntelligenceService();
    this.learningService = new LearningService();
    this.marketService = new MarketAnalysisService();
  }

  // Learning & Development
  generateLearningPath = async (req: Request, res: Response) => {
    try {
      const { skill, currentLevel, targetLevel, timeframe } = req.body;
      
      if (!skill || !currentLevel || !targetLevel) {
        return res.status(400).json({ 
          error: 'Skill, currentLevel, and targetLevel required' 
        });
      }

      const learningPath = await this.learningService.generateLearningPath(
        skill,
        currentLevel,
        targetLevel,
        timeframe
      );
      
      res.json({
        success: true,
        data: learningPath
      });
    } catch (error) {
      logger.error('Generate learning path error:', error);
      res.status(500).json({ error: 'Failed to generate learning path' });
    }
  };

  assessSkills = async (req: Request, res: Response) => {
    try {
      const { userId, skills, experience, projects } = req.body;
      
      if (!userId || !skills || !experience) {
        return res.status(400).json({ 
          error: 'UserId, skills, and experience required' 
        });
      }

      const assessment = await this.learningService.assessSkills(
        userId,
        skills,
        experience,
        projects || []
      );
      
      res.json({
        success: true,
        data: assessment
      });
    } catch (error) {
      logger.error('Skill assessment error:', error);
      res.status(500).json({ error: 'Failed to assess skills' });
    }
  };

  recommendResources = async (req: Request, res: Response) => {
    try {
      const { skill, level, learningStyle } = req.body;
      
      if (!skill || !level) {
        return res.status(400).json({ error: 'Skill and level required' });
      }

      const resources = await this.learningService.recommendResources(
        skill,
        level,
        learningStyle
      );
      
      res.json({
        success: true,
        data: resources
      });
    } catch (error) {
      logger.error('Resource recommendation error:', error);
      res.status(500).json({ error: 'Failed to recommend resources' });
    }
  };

  trackProgress = async (req: Request, res: Response) => {
    try {
      const { userId, skill, completedResources, timeSpent } = req.body;
      
      if (!userId || !skill || !completedResources || timeSpent === undefined) {
        return res.status(400).json({ 
          error: 'UserId, skill, completedResources, and timeSpent required' 
        });
      }

      const progress = await this.learningService.trackProgress(
        userId,
        skill,
        completedResources,
        timeSpent
      );
      
      res.json({
        success: true,
        data: progress
      });
    } catch (error) {
      logger.error('Progress tracking error:', error);
      res.status(500).json({ error: 'Failed to track progress' });
    }
  };

  // Market Analysis
  analyzeMarketTrends = async (req: Request, res: Response) => {
    try {
      const { skills, location, industry } = req.body;
      
      if (!skills || !Array.isArray(skills)) {
        return res.status(400).json({ error: 'Skills array required' });
      }

      const trends = await this.marketService.analyzeMarketTrends(
        skills,
        location,
        industry
      );
      
      res.json({
        success: true,
        data: trends
      });
    } catch (error) {
      logger.error('Market trend analysis error:', error);
      res.status(500).json({ error: 'Failed to analyze market trends' });
    }
  };

  generatePersonalizedAlerts = async (req: Request, res: Response) => {
    try {
      const { userId, userSkills, careerGoals, preferences } = req.body;
      
      if (!userId || !userSkills || !careerGoals) {
        return res.status(400).json({ 
          error: 'UserId, userSkills, and careerGoals required' 
        });
      }

      const alerts = await this.marketService.generatePersonalizedAlerts(
        userId,
        userSkills,
        careerGoals,
        preferences || {}
      );
      
      res.json({
        success: true,
        data: alerts
      });
    } catch (error) {
      logger.error('Alert generation error:', error);
      res.status(500).json({ error: 'Failed to generate alerts' });
    }
  };

  predictSalaryTrends = async (req: Request, res: Response) => {
    try {
      const { role, location, experience } = req.body;
      
      if (!role || !location || experience === undefined) {
        return res.status(400).json({ 
          error: 'Role, location, and experience required' 
        });
      }

      const prediction = await this.marketService.predictSalaryTrends(
        role,
        location,
        experience
      );
      
      res.json({
        success: true,
        data: prediction
      });
    } catch (error) {
      logger.error('Salary prediction error:', error);
      res.status(500).json({ error: 'Failed to predict salary trends' });
    }
  };
}