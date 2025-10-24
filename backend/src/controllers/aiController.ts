import { Request, Response } from 'express';
import { NLPService } from '../services/nlpService';
import { InterviewPrepService } from '../services/interviewPrepService';
import { CareerIntelligenceService } from '../services/careerIntelligenceService';
import { logger } from '../config/logger';

export class AIController {
  private nlpService: NLPService;
  private interviewService: InterviewPrepService;
  private careerService: CareerIntelligenceService;

  constructor() {
    this.nlpService = new NLPService();
    this.interviewService = new InterviewPrepService();
    this.careerService = new CareerIntelligenceService();
  }

  // Natural Language Search
  parseJobQuery = async (req: Request, res: Response) => {
    try {
      const { query, userId } = req.body;
      
      if (!query || !userId) {
        return res.status(400).json({ error: 'Query and userId required' });
      }

      const searchIntent = await this.nlpService.parseJobSearchQuery(query, userId);
      
      res.json({
        success: true,
        data: {
          originalQuery: query,
          parsedIntent: searchIntent,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Parse job query error:', error);
      res.status(500).json({ error: 'Failed to parse job query' });
    }
  };

  // Interview Preparation
  createMockInterview = async (req: Request, res: Response) => {
    try {
      const { userId, jobTitle, company } = req.body;
      
      if (!userId || !jobTitle) {
        return res.status(400).json({ error: 'UserId and jobTitle required' });
      }

      const session = await this.interviewService.generateMockInterview(
        userId, 
        jobTitle, 
        company
      );
      
      res.json({
        success: true,
        data: session
      });
    } catch (error) {
      logger.error('Create mock interview error:', error);
      res.status(500).json({ error: 'Failed to create mock interview' });
    }
  };

  analyzeInterviewResponse = async (req: Request, res: Response) => {
    try {
      const { sessionId, questionId, answer } = req.body;
      
      if (!sessionId || !questionId || !answer) {
        return res.status(400).json({ error: 'SessionId, questionId, and answer required' });
      }

      const analysis = await this.interviewService.analyzeResponse(
        sessionId, 
        questionId, 
        answer
      );
      
      res.json({
        success: true,
        data: analysis
      });
    } catch (error) {
      logger.error('Analyze interview response error:', error);
      res.status(500).json({ error: 'Failed to analyze response' });
    }
  };

  // Career Intelligence
  generateCareerPath = async (req: Request, res: Response) => {
    try {
      const { currentRole, targetRole, currentSkills, experience } = req.body;
      
      if (!currentRole || !targetRole || !currentSkills || experience === undefined) {
        return res.status(400).json({ 
          error: 'CurrentRole, targetRole, currentSkills, and experience required' 
        });
      }

      const careerPath = await this.careerService.generateCareerPath(
        currentRole,
        targetRole,
        currentSkills,
        experience
      );
      
      res.json({
        success: true,
        data: careerPath
      });
    } catch (error) {
      logger.error('Generate career path error:', error);
      res.status(500).json({ error: 'Failed to generate career path' });
    }
  };

  analyzeSkillGaps = async (req: Request, res: Response) => {
    try {
      const { currentSkills, targetRole } = req.body;
      
      if (!currentSkills || !targetRole) {
        return res.status(400).json({ error: 'CurrentSkills and targetRole required' });
      }

      const skillGaps = await this.careerService.analyzeSkillGaps(
        currentSkills,
        targetRole
      );
      
      res.json({
        success: true,
        data: skillGaps
      });
    } catch (error) {
      logger.error('Analyze skill gaps error:', error);
      res.status(500).json({ error: 'Failed to analyze skill gaps' });
    }
  };

  getMarketInsights = async (req: Request, res: Response) => {
    try {
      const { role, location } = req.query;
      
      if (!role) {
        return res.status(400).json({ error: 'Role parameter required' });
      }

      const insights = await this.careerService.getMarketInsights(
        role as string,
        location as string
      );
      
      res.json({
        success: true,
        data: insights
      });
    } catch (error) {
      logger.error('Get market insights error:', error);
      res.status(500).json({ error: 'Failed to get market insights' });
    }
  };
}