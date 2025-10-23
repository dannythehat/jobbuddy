import { Request, Response } from 'express';
import { Application } from '../models/Application';
import { CV } from '../models/CV';
import { Job } from '../models/Job';
import { JobPreference } from '../models/JobPreference';
import { User } from '../models/User';
import { ApplicationGenerator, GenerateApplicationOptions } from '../services/applicationGenerator';
import { Op } from 'sequelize';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export class ApplicationController {
  /**
   * Check for duplicate applications
   */
  static async checkDuplicateApplication(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { jobId, cvId } = req.query;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      if (!jobId) {
        return res.status(400).json({
          success: false,
          error: 'Job ID is required'
        });
      }

      // Check for existing application to this job by this user
      const existingApplication = await Application.findOne({
        where: {
          userId,
          jobId: jobId as string,
          ...(cvId && { cvId: cvId as string })
        },
        include: [
          {
            model: Job,
            as: 'job',
            attributes: ['id', 'title', 'company']
          }
        ]
      });

      res.json({
        success: true,
        data: {
          isDuplicate: !!existingApplication,
          existingApplication: existingApplication || null
        }
      });
    } catch (error) {
      console.error('Error checking duplicate application:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to check for duplicate application'
      });
    }
  }

  /**
   * Get all applications for the authenticated user
   */
  static async getApplications(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { 
        status, 
        applicationMethod, 
        dateFrom, 
        dateTo, 
        search,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        page = 1,
        limit = 20
      } = req.query;

      // Build where clause
      const whereClause: any = { userId };
      
      if (status && status !== 'all') {
        whereClause.status = status;
      }
      
      if (applicationMethod && applicationMethod !== 'all') {
        whereClause.applicationMethod = applicationMethod;
      }
      
      if (dateFrom || dateTo) {
        whereClause.createdAt = {};
        if (dateFrom) whereClause.createdAt[Op.gte] = new Date(dateFrom as string);
        if (dateTo) whereClause.createdAt[Op.lte] = new Date(dateTo as string);
      }

      // Search in job title, company, or notes
      if (search) {
        whereClause[Op.or] = [
          { notes: { [Op.iLike]: `%${search}%` } },
          { rejectionReason: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const offset = (Number(page) - 1) * Number(limit);

      const { rows: applications, count } = await Application.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Job,
            as: 'job',
            attributes: ['id', 'title', 'company', 'location', 'salaryMin', 'salaryMax'],
            ...(search && {
              where: {
                [Op.or]: [
                  { title: { [Op.iLike]: `%${search}%` } },
                  { company: { [Op.iLike]: `%${search}%` } }
                ]
              }
            })
          },
          {
            model: CV,
            as: 'cv',
            attributes: ['id', 'filename', 'isDefault']
          }
        ],
        order: [[sortBy as string, sortOrder as string]],
        limit: Number(limit),
        offset
      });

      res.json({
        success: true,
        data: {
          applications,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: count,
            pages: Math.ceil(count / Number(limit))
          }
        }
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
   * Create a new application (draft) with duplicate prevention
   */
  static async createApplication(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { 
        jobId, 
        cvId, 
        notes, 
        applicationMethod,
        referralSource,
        jobBoardUrl,
        jobBoardId,
        allowDuplicate = false
      } = req.body;

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

      // Check for duplicate application unless explicitly allowed
      if (!allowDuplicate) {
        const existingApplication = await Application.findOne({
          where: { userId, jobId }
        });

        if (existingApplication) {
          return res.status(409).json({
            success: false,
            error: 'You have already applied to this job',
            data: {
              existingApplication: {
                id: existingApplication.id,
                status: existingApplication.status,
                submissionDate: existingApplication.submissionDate,
                createdAt: existingApplication.createdAt
              }
            }
          });
        }
      }

      // Initialize status history
      const statusHistory = [{
        status: 'draft',
        date: new Date(),
        notes: 'Application created'
      }];

      const application = await Application.create({
        userId,
        jobId,
        cvId,
        status: 'draft',
        notes,
        applicationMethod,
        referralSource,
        jobBoardUrl,
        jobBoardId,
        statusHistory,
        communications: [],
        followUpDates: []
      });

      // Fetch the created application with includes
      const createdApplication = await Application.findByPk(application.id, {
        include: [
          {
            model: Job,
            as: 'job',
            attributes: ['id', 'title', 'company', 'location']
          },
          {
            model: CV,
            as: 'cv',
            attributes: ['id', 'filename', 'isDefault']
          }
        ]
      });

      res.status(201).json({
        success: true,
        data: createdApplication
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
   * Update an application with enhanced tracking
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
        'responseDate', 'responseType', 'interviewDate', 'interviewNotes', 
        'offerDetails', 'applicationMethod', 'referralSource', 'followUpDates',
        'rejectionReason', 'rejectionFeedback', 'salaryOffered', 'negotiationNotes',
        'jobBoardUrl', 'jobBoardId', 'communications'
      ];

      const filteredUpdateData = Object.keys(updateData)
        .filter(key => allowedFields.includes(key))
        .reduce((obj: any, key) => {
          obj[key] = updateData[key];
          return obj;
        }, {});

      // Handle status change tracking
      if (filteredUpdateData.status && filteredUpdateData.status !== application.status) {
        const statusHistory = application.statusHistory || [];
        statusHistory.push({
          status: filteredUpdateData.status,
          date: new Date(),
          notes: updateData.statusChangeNotes || `Status changed to ${filteredUpdateData.status}`
        });
        filteredUpdateData.statusHistory = statusHistory;
      }

      await application.update(filteredUpdateData);

      // Fetch updated application with includes
      const updatedApplication = await Application.findByPk(id, {
        include: [
          {
            model: Job,
            as: 'job',
            attributes: ['id', 'title', 'company', 'location']
          },
          {
            model: CV,
            as: 'cv',
            attributes: ['id', 'filename', 'isDefault']
          }
        ]
      });

      res.json({
        success: true,
        data: updatedApplication
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
   * Add communication to application
   */
  static async addCommunication(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      const { type, direction, subject, summary, date } = req.body;

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

      const communications = application.communications || [];
      communications.push({
        date: date ? new Date(date) : new Date(),
        type,
        direction,
        subject,
        summary
      });

      await application.update({ communications });

      res.json({
        success: true,
        data: application
      });
    } catch (error) {
      console.error('Error adding communication:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add communication'
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
   * Get application statistics for the user with enhanced metrics
   */
  static async getApplicationStats(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Basic status breakdown
      const statusStats = await Application.findAll({
        where: { userId },
        attributes: [
          'status',
          [Application.sequelize!.fn('COUNT', '*'), 'count']
        ],
        group: ['status'],
        raw: true
      });

      // Application method breakdown
      const methodStats = await Application.findAll({
        where: { userId },
        attributes: [
          'applicationMethod',
          [Application.sequelize!.fn('COUNT', '*'), 'count']
        ],
        group: ['applicationMethod'],
        raw: true
      });

      // Calculate additional metrics
      const totalApplications = await Application.count({ where: { userId } });
      const submittedApplications = await Application.count({
        where: { userId, status: ['submitted', 'interviewing', 'offered', 'accepted', 'rejected'] }
      });
      
      const interviewApplications = await Application.count({
        where: { userId, status: ['interviewing', 'offered', 'accepted'] }
      });
      
      const offerApplications = await Application.count({
        where: { userId, status: ['offered', 'accepted'] }
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

      const interviewRate = submittedApplications > 0 ? (interviewApplications / submittedApplications) * 100 : 0;
      const offerRate = submittedApplications > 0 ? (offerApplications / submittedApplications) * 100 : 0;

      // Recent activity (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentApplications = await Application.count({
        where: {
          userId,
          createdAt: { [Op.gte]: thirtyDaysAgo }
        }
      });

      res.json({
        success: true,
        data: {
          statusBreakdown: statusStats,
          methodBreakdown: methodStats,
          totalApplications,
          submittedApplications,
          interviewApplications,
          offerApplications,
          responseRate: Math.round(responseRate * 100) / 100,
          interviewRate: Math.round(interviewRate * 100) / 100,
          offerRate: Math.round(offerRate * 100) / 100,
          recentApplications
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

  /**
   * Get application timeline
   */
  static async getApplicationTimeline(req: AuthenticatedRequest, res: Response) {
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
            as: 'job',
            attributes: ['id', 'title', 'company']
          }
        ]
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          error: 'Application not found'
        });
      }

      // Combine status history and communications into timeline
      const timeline = [];

      // Add status history
      if (application.statusHistory) {
        application.statusHistory.forEach((status: any) => {
          timeline.push({
            type: 'status_change',
            date: status.date,
            title: `Status changed to ${status.status}`,
            description: status.notes,
            status: status.status
          });
        });
      }

      // Add communications
      if (application.communications) {
        application.communications.forEach((comm: any) => {
          timeline.push({
            type: 'communication',
            date: comm.date,
            title: `${comm.type} (${comm.direction})`,
            description: comm.summary,
            subject: comm.subject
          });
        });
      }

      // Add follow-up dates
      if (application.followUpDates) {
        application.followUpDates.forEach((date: any) => {
          timeline.push({
            type: 'follow_up',
            date: date,
            title: 'Follow-up scheduled',
            description: 'Follow-up reminder'
          });
        });
      }

      // Sort timeline by date
      timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      res.json({
        success: true,
        data: {
          application: {
            id: application.id,
            job: application.job,
            status: application.status
          },
          timeline
        }
      });
    } catch (error) {
      console.error('Error fetching application timeline:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch application timeline'
      });
    }
  }
}

export default ApplicationController;