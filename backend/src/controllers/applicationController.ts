import { Request, Response } from 'express';
import { Application } from '../models/Application';
import { CV } from '../models/CV';
import { Job } from '../models/Job';
import { JobPreference } from '../models/JobPreference';
import { User } from '../models/User';
import { ApplicationGenerator, GenerateApplicationOptions } from '../services/applicationGenerator';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export class ApplicationController {
  /**
   * Get all applications for the authenticated user
   */
  static async getApplications(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const applications = await Application.findAll({
        where: { userId },
        include: [
          {
            model: Job,
            as: 'job',
            attributes: ['id', 'title', 'company', 'location', 'salaryMin', 'salaryMax']
          },
          {
            model: CV,
            as: 'cv',
            attributes: ['id', 'filename', 'isDefault']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: applications
      });
    } catch (error) {
      console.error('Error fetching applications:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch applications'
      });
    }
  }

  /**
   * Get a specific application by ID
   */
  static async getApplication(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const application = await Application.findOne({
        where: { id, userId },
        include: [
          {
            model: Job,
            as: 'job'
          },
          {
            model: CV,
            as: 'cv'
          }
        ]
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          error: 'Application not found'
        });
      }

      res.json({
        success: true,
        data: application
      });
    } catch (error) {
      console.error('Error fetching application:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch application'
      });
    }
  }

  /**
   * Create a new application (draft)
   */
  static async createApplication(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { jobId, cvId, notes } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Validate that job and CV exist and belong to user
      const job = await Job.findByPk(jobId);
      const cv = await CV.findOne({ where: { id: cvId, userId } });

      if (!job) {
        return res.status(404).json({
          success: false,
          error: 'Job not found'
        });
      }

      if (!cv) {
        return res.status(404).json({
          success: false,
          error: 'CV not found or does not belong to user'
        });
      }

      // Check if application already exists
      const existingApplication = await Application.findOne({
        where: { userId, jobId, cvId }
      });

      if (existingApplication) {
        return res.status(400).json({
          success: false,
          error: 'Application already exists for this job and CV combination'
        });
      }

      const application = await Application.create({
        userId,
        jobId,
        cvId,
        status: 'draft',
        notes
      });

      res.status(201).json({
        success: true,
        data: application
      });
    } catch (error) {
      console.error('Error creating application:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create application'
      });
    }
  }

  /**
   * Generate AI-powered application content
   */
  static async generateApplicationContent(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { jobId, cvId, options = {} } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Fetch required data
      const [job, cv, jobPreferences] = await Promise.all([
        Job.findByPk(jobId),
        CV.findOne({ where: { id: cvId, userId } }),
        JobPreference.findOne({ where: { userId } })
      ]);

      if (!job) {
        return res.status(404).json({
          success: false,
          error: 'Job not found'
        });
      }

      if (!cv) {
        return res.status(404).json({
          success: false,
          error: 'CV not found or does not belong to user'
        });
      }

      if (!jobPreferences) {
        return res.status(400).json({
          success: false,
          error: 'Job preferences not found. Please set up your preferences first.'
        });
      }

      // Generate application content
      const applicationContent = await ApplicationGenerator.generateApplication(
        cv,
        job,
        jobPreferences,
        options as GenerateApplicationOptions
      );

      res.json({
        success: true,
        data: applicationContent
      });
    } catch (error) {
      console.error('Error generating application content:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate application content'
      });
    }
  }

  /**
   * Generate multiple cover letter variations
   */
  static async generateCoverLetterVariations(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { jobId, cvId, count = 3 } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Fetch required data
      const [job, cv, jobPreferences] = await Promise.all([
        Job.findByPk(jobId),
        CV.findOne({ where: { id: cvId, userId } }),
        JobPreference.findOne({ where: { userId } })
      ]);

      if (!job || !cv || !jobPreferences) {
        return res.status(404).json({
          success: false,
          error: 'Required data not found'
        });
      }

      // Generate variations
      const variations = await ApplicationGenerator.generateCoverLetterVariations(
        cv,
        job,
        jobPreferences,
        count
      );

      res.json({
        success: true,
        data: { variations }
      });
    } catch (error) {
      console.error('Error generating cover letter variations:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate cover letter variations'
      });
    }
  }

  /**
   * Update an application
   */
  static async updateApplication(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      const updateData = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const application = await Application.findOne({
        where: { id, userId }
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          error: 'Application not found'
        });
      }

      // Update allowed fields
      const allowedFields = [
        'status', 'coverLetter', 'notes', 'submissionDate',
        'responseDate', 'responseType', 'interviewDate', 'interviewNotes', 'offerDetails'
      ];

      const filteredUpdateData = Object.keys(updateData)
        .filter(key => allowedFields.includes(key))
        .reduce((obj: any, key) => {
          obj[key] = updateData[key];
          return obj;
        }, {});

      await application.update(filteredUpdateData);

      res.json({
        success: true,
        data: application
      });
    } catch (error) {
      console.error('Error updating application:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update application'
      });
    }
  }

  /**
   * Delete an application
   */
  static async deleteApplication(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const application = await Application.findOne({
        where: { id, userId }
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          error: 'Application not found'
        });
      }

      await application.destroy();

      res.json({
        success: true,
        message: 'Application deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting application:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete application'
      });
    }
  }

  /**
   * Get application statistics for the user
   */
  static async getApplicationStats(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const stats = await Application.findAll({
        where: { userId },
        attributes: [
          'status',
          [Application.sequelize!.fn('COUNT', '*'), 'count']
        ],
        group: ['status'],
        raw: true
      });

      // Calculate additional metrics
      const totalApplications = await Application.count({ where: { userId } });
      const submittedApplications = await Application.count({
        where: { userId, status: ['submitted', 'interviewing', 'offered', 'accepted', 'rejected'] }
      });
      const responseRate = submittedApplications > 0 
        ? await Application.count({
            where: { 
              userId, 
              responseType: ['positive', 'negative'],
              status: ['interviewing', 'offered', 'accepted', 'rejected']
            }
          }) / submittedApplications * 100
        : 0;

      res.json({
        success: true,
        data: {
          statusBreakdown: stats,
          totalApplications,
          submittedApplications,
          responseRate: Math.round(responseRate * 100) / 100
        }
      });
    } catch (error) {
      console.error('Error fetching application stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch application statistics'
      });
    }
  }

  /**
   * Optimize application based on feedback
   */
  static async optimizeApplication(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      const { feedback } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      if (!feedback) {
        return res.status(400).json({
          success: false,
          error: 'Feedback is required for optimization'
        });
      }

      const application = await Application.findOne({
        where: { id, userId },
        include: [
          { model: Job, as: 'job' },
          { model: CV, as: 'cv' }
        ]
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          error: 'Application not found'
        });
      }

      // Create application content object from current application
      const currentContent = {
        coverLetter: application.coverLetter || '',
        applicationNotes: application.notes || '',
        keyPoints: [],
        matchingSkills: [],
        addressedRequirements: []
      };

      // Optimize the application
      const optimizedContent = await ApplicationGenerator.optimizeApplication(
        currentContent,
        feedback,
        application.cv as CV,
        application.job as Job
      );

      // Update the application with optimized content
      await application.update({
        coverLetter: optimizedContent.coverLetter,
        notes: optimizedContent.applicationNotes
      });

      res.json({
        success: true,
        data: {
          application,
          optimizedContent
        }
      });
    } catch (error) {
      console.error('Error optimizing application:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to optimize application'
      });
    }
  }
}

export default ApplicationController;