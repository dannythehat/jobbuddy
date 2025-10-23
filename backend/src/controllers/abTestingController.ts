import { Request, Response } from 'express';
import { abTestingService, ABTestConfig } from '../services/abTestingService';

export class ABTestingController {
  
  async createTest(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const config: ABTestConfig = req.body;
      
      // Validate required fields
      if (!config.name || !config.variants || config.variants.length < 2) {
        return res.status(400).json({ 
          error: 'Invalid test configuration',
          details: 'Name and at least 2 variants are required'
        });
      }

      const test = await abTestingService.createTest(userId, config);
      
      res.status(201).json({
        success: true,
        data: test,
        message: 'A/B test created successfully'
      });
    } catch (error) {
      console.error('Error creating A/B test:', error);
      res.status(500).json({ 
        error: 'Failed to create A/B test',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async startTest(req: Request, res: Response) {
    try {
      const { testId } = req.params;
      
      const test = await abTestingService.startTest(testId);
      
      res.json({
        success: true,
        data: test,
        message: 'A/B test started successfully'
      });
    } catch (error) {
      console.error('Error starting A/B test:', error);
      res.status(500).json({ 
        error: 'Failed to start A/B test',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async pauseTest(req: Request, res: Response) {
    try {
      const { testId } = req.params;
      
      const test = await abTestingService.pauseTest(testId);
      
      res.json({
        success: true,
        data: test,
        message: 'A/B test paused successfully'
      });
    } catch (error) {
      console.error('Error pausing A/B test:', error);
      res.status(500).json({ 
        error: 'Failed to pause A/B test',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async completeTest(req: Request, res: Response) {
    try {
      const { testId } = req.params;
      
      const test = await abTestingService.completeTest(testId);
      
      res.json({
        success: true,
        data: test,
        message: 'A/B test completed successfully'
      });
    } catch (error) {
      console.error('Error completing A/B test:', error);
      res.status(500).json({ 
        error: 'Failed to complete A/B test',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async assignVariant(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { testId } = req.params;
      const { applicationId, context } = req.body;
      
      const assignment = await abTestingService.assignVariant(testId, userId, applicationId, context);
      
      res.json({
        success: true,
        data: assignment
      });
    } catch (error) {
      console.error('Error assigning variant:', error);
      res.status(500).json({ 
        error: 'Failed to assign variant',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async recordConversion(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { testId } = req.params;
      const { conversionType, applicationId, conversionValue } = req.body;
      
      if (!conversionType) {
        return res.status(400).json({ 
          error: 'Conversion type is required'
        });
      }

      await abTestingService.recordConversion(testId, userId, conversionType, applicationId, conversionValue);
      
      res.json({
        success: true,
        message: 'Conversion recorded successfully'
      });
    } catch (error) {
      console.error('Error recording conversion:', error);
      res.status(500).json({ 
        error: 'Failed to record conversion',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async analyzeTest(req: Request, res: Response) {
    try {
      const { testId } = req.params;
      
      const results = await abTestingService.analyzeTest(testId);
      
      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error analyzing A/B test:', error);
      res.status(500).json({ 
        error: 'Failed to analyze A/B test',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getActiveTests(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { type } = req.query;
      
      const tests = await abTestingService.getActiveTests(userId, type as string);
      
      res.json({
        success: true,
        data: tests
      });
    } catch (error) {
      console.error('Error fetching active tests:', error);
      res.status(500).json({ 
        error: 'Failed to fetch active tests',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getUserTests(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const tests = await abTestingService.getUserTests(userId);
      
      res.json({
        success: true,
        data: tests
      });
    } catch (error) {
      console.error('Error fetching user tests:', error);
      res.status(500).json({ 
        error: 'Failed to fetch user tests',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getTestResults(req: Request, res: Response) {
    try {
      const { testId } = req.params;
      
      const results = await abTestingService.analyzeTest(testId);
      
      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error fetching test results:', error);
      res.status(500).json({ 
        error: 'Failed to fetch test results',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getTestTemplates(req: Request, res: Response) {
    try {
      const templates = [
        {
          id: 'cover_letter_tone',
          name: 'Cover Letter Tone Test',
          description: 'Test different tones in cover letters (professional vs. enthusiastic)',
          type: 'cover_letter',
          variants: [
            {
              name: 'Professional Tone',
              content: {
                tone: 'professional',
                style: 'formal',
                keywords: ['experienced', 'qualified', 'professional']
              },
              weight: 50
            },
            {
              name: 'Enthusiastic Tone',
              content: {
                tone: 'enthusiastic',
                style: 'engaging',
                keywords: ['excited', 'passionate', 'eager']
              },
              weight: 50
            }
          ],
          targetMetric: 'response_rate',
          minimumSampleSize: 50,
          expectedEffect: 15
        },
        {
          id: 'application_timing',
          name: 'Application Timing Test',
          description: 'Test optimal times for job applications',
          type: 'timing',
          variants: [
            {
              name: 'Morning (9-11 AM)',
              content: { timeRange: '09:00-11:00', timezone: 'local' },
              weight: 33.33
            },
            {
              name: 'Afternoon (1-3 PM)',
              content: { timeRange: '13:00-15:00', timezone: 'local' },
              weight: 33.33
            },
            {
              name: 'Evening (5-7 PM)',
              content: { timeRange: '17:00-19:00', timezone: 'local' },
              weight: 33.34
            }
          ],
          targetMetric: 'response_rate',
          minimumSampleSize: 75,
          expectedEffect: 10
        },
        {
          id: 'subject_line_style',
          name: 'Email Subject Line Test',
          description: 'Test different email subject line styles',
          type: 'subject_line',
          variants: [
            {
              name: 'Direct',
              content: {
                template: 'Application for {jobTitle} - {userName}',
                style: 'direct'
              },
              weight: 50
            },
            {
              name: 'Question-based',
              content: {
                template: 'Could I be your next {jobTitle}?',
                style: 'question'
              },
              weight: 50
            }
          ],
          targetMetric: 'open_rate',
          minimumSampleSize: 40,
          expectedEffect: 20
        },
        {
          id: 'follow_up_timing',
          name: 'Follow-up Timing Test',
          description: 'Test optimal timing for follow-up emails',
          type: 'follow_up',
          variants: [
            {
              name: '1 Week Follow-up',
              content: { days: 7, message: 'polite_inquiry' },
              weight: 50
            },
            {
              name: '2 Week Follow-up',
              content: { days: 14, message: 'polite_inquiry' },
              weight: 50
            }
          ],
          targetMetric: 'response_rate',
          minimumSampleSize: 60,
          expectedEffect: 12
        }
      ];

      res.json({
        success: true,
        data: templates
      });
    } catch (error) {
      console.error('Error fetching test templates:', error);
      res.status(500).json({ 
        error: 'Failed to fetch test templates',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async createFromTemplate(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { templateId, customizations } = req.body;
      
      // This would fetch the template and apply customizations
      // For now, return a placeholder response
      res.json({
        success: true,
        message: 'Test created from template',
        data: { templateId, customizations }
      });
    } catch (error) {
      console.error('Error creating test from template:', error);
      res.status(500).json({ 
        error: 'Failed to create test from template',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export const abTestingController = new ABTestingController();