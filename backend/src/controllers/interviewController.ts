import { Request, Response as ExpressResponse } from 'express';
import { Interview } from '../models/Interview';
import { Response } from '../models/Response';
import { Application } from '../models/Application';
import { Job } from '../models/Job';
import InterviewScheduler from '../services/interviewScheduler';
import CalendarService from '../services/calendarService';
import EmailResponseService from '../services/emailResponseService';
import { Op } from 'sequelize';

export class InterviewController {
  private interviewScheduler: InterviewScheduler;
  private calendarService: CalendarService;

  constructor() {
    this.interviewScheduler = new InterviewScheduler();
    this.calendarService = new CalendarService();
  }

  /**
   * Get all interviews for a user with filtering and pagination
   */
  static async getInterviews(req: Request, res: ExpressResponse) {
    try {
      const userId = req.user?.id;
      const {
        page = 1,
        limit = 20,
        status,
        upcoming,
        past,
        search,
        sortBy = 'scheduledDate',
        sortOrder = 'ASC'
      } = req.query;

      const offset = (Number(page) - 1) * Number(limit);
      
      // Build where clause
      const whereClause: any = { userId };
      
      if (status) {
        whereClause.status = status;
      }
      
      const now = new Date();
      if (upcoming === 'true') {
        whereClause.scheduledDate = { [Op.gt]: now };
      } else if (past === 'true') {
        whereClause.scheduledDate = { [Op.lt]: now };
      }
      
      if (search) {
        whereClause[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { location: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { rows: interviews, count } = await Interview.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Application,
            as: 'application',
            include: [
              {
                model: Job,
                as: 'job',
                attributes: ['id', 'title', 'company', 'location']
              }
            ]
          },
          {
            model: Response,
            as: 'response',
            attributes: ['id', 'subject', 'sender', 'senderName']
          }
        ],
        order: [[sortBy as string, sortOrder as string]],
        limit: Number(limit),
        offset,
      });

      res.json({
        success: true,
        data: {
          interviews,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: count,
            pages: Math.ceil(count / Number(limit))
          }
        }
      });
    } catch (error) {
      console.error('Error fetching interviews:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch interviews'
      });
    }
  }

  /**
   * Get a specific interview by ID
   */
  static async getInterview(req: Request, res: ExpressResponse) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const interview = await Interview.findOne({
        where: { id, userId },
        include: [
          {
            model: Application,
            as: 'application',
            include: [
              {
                model: Job,
                as: 'job'
              }
            ]
          },
          {
            model: Response,
            as: 'response'
          }
        ]
      });

      if (!interview) {
        return res.status(404).json({
          success: false,
          message: 'Interview not found'
        });
      }

      res.json({
        success: true,
        data: interview
      });
    } catch (error) {
      console.error('Error fetching interview:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch interview'
      });
    }
  }

  /**
   * Schedule interview from response
   */
  static async scheduleInterview(req: Request, res: ExpressResponse) {
    try {
      const userId = req.user?.id;
      const {
        responseId,
        userAction,
        rescheduleOptions,
        calendarPreferences,
        userPreferences
      } = req.body;

      const scheduler = new InterviewScheduler();
      const result = await scheduler.scheduleInterview({
        responseId,
        userAction,
        rescheduleOptions,
        calendarPreferences,
        userPreferences: {
          ...userPreferences,
          email: req.user?.email || userPreferences?.email
        }
      });

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: 'Failed to schedule interview',
          errors: result.errors,
          warnings: result.warnings
        });
      }

      res.json({
        success: true,
        data: {
          interview: result.interview,
          calendarEventId: result.calendarEventId,
          emailResponse: result.emailResponse,
          warnings: result.warnings
        }
      });
    } catch (error) {
      console.error('Error scheduling interview:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to schedule interview'
      });
    }
  }

  /**
   * Update interview details
   */
  static async updateInterview(req: Request, res: ExpressResponse) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const updateData = req.body;

      const interview = await Interview.findOne({
        where: { id, userId }
      });

      if (!interview) {
        return res.status(404).json({
          success: false,
          message: 'Interview not found'
        });
      }

      // Update calendar event if it exists and relevant fields changed
      if (interview.calendarEventId && interview.calendarSynced) {
        const fieldsToCheck = ['title', 'description', 'scheduledDate', 'duration', 'location', 'meetingUrl'];
        const hasRelevantChanges = fieldsToCheck.some(field => updateData[field] !== undefined);

        if (hasRelevantChanges) {
          try {
            // TODO: Update calendar event
            // This would require calendar credentials to be stored/retrieved
            console.log('Calendar event update needed for interview:', id);
          } catch (calendarError) {
            console.error('Failed to update calendar event:', calendarError);
          }
        }
      }

      await interview.update(updateData);

      res.json({
        success: true,
        data: interview
      });
    } catch (error) {
      console.error('Error updating interview:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update interview'
      });
    }
  }

  /**
   * Cancel interview
   */
  static async cancelInterview(req: Request, res: ExpressResponse) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { reason, sendNotification = true } = req.body;

      const interview = await Interview.findOne({
        where: { id, userId },
        include: [
          {
            model: Application,
            as: 'application',
            include: [
              {
                model: Job,
                as: 'job'
              }
            ]
          }
        ]
      });

      if (!interview) {
        return res.status(404).json({
          success: false,
          message: 'Interview not found'
        });
      }

      // Update interview status
      await interview.update({
        status: 'cancelled',
        rescheduleReason: reason
      });

      // Delete calendar event if it exists
      if (interview.calendarEventId && interview.calendarSynced) {
        try {
          // TODO: Delete calendar event
          // This would require calendar credentials
          console.log('Calendar event deletion needed for interview:', id);
        } catch (calendarError) {
          console.error('Failed to delete calendar event:', calendarError);
        }
      }

      // Generate cancellation email if requested
      let emailResponse = null;
      if (sendNotification) {
        try {
          emailResponse = await EmailResponseService.generateResponse(
            {
              subject: `Interview Cancellation - ${interview.title}`,
              content: `Interview scheduled for ${interview.scheduledDate}`,
              sender: 'system@jobbuddy.com',
              senderName: 'JobBuddy'
            },
            {
              action: 'decline',
              tone: 'professional',
              userPreferences: {
                name: req.user?.name || 'User'
              },
              interviewDetails: {
                company: interview.application?.job?.company || '',
                position: interview.application?.job?.title || '',
                interviewer: interview.interviewers[0]?.name || 'Hiring Manager'
              }
            }
          );
        } catch (emailError) {
          console.error('Failed to generate cancellation email:', emailError);
        }
      }

      res.json({
        success: true,
        data: {
          interview,
          emailResponse
        }
      });
    } catch (error) {
      console.error('Error cancelling interview:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cancel interview'
      });
    }
  }

  /**
   * Get upcoming interviews
   */
  static async getUpcomingInterviews(req: Request, res: ExpressResponse) {
    try {
      const userId = req.user?.id;
      const { days = 7 } = req.query;

      const scheduler = new InterviewScheduler();
      const interviews = await scheduler.getUpcomingInterviews(userId!, Number(days));

      res.json({
        success: true,
        data: interviews
      });
    } catch (error) {
      console.error('Error fetching upcoming interviews:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch upcoming interviews'
      });
    }
  }

  /**
   * Get interview analytics
   */
  static async getInterviewAnalytics(req: Request, res: ExpressResponse) {
    try {
      const userId = req.user?.id;
      const { timeframe = '30' } = req.query;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - Number(timeframe));

      // Get interview counts by status
      const statusStats = await Interview.findAll({
        where: {
          userId,
          createdAt: { [Op.gte]: startDate }
        },
        attributes: [
          'status',
          [Interview.sequelize!.fn('COUNT', Interview.sequelize!.col('id')), 'count']
        ],
        group: ['status'],
        raw: true
      });

      // Get interview counts by type
      const typeStats = await Interview.findAll({
        where: {
          userId,
          createdAt: { [Op.gte]: startDate }
        },
        attributes: [
          'type',
          [Interview.sequelize!.fn('COUNT', Interview.sequelize!.col('id')), 'count']
        ],
        group: ['type'],
        raw: true
      });

      // Get upcoming interviews count
      const upcomingCount = await Interview.count({
        where: {
          userId,
          scheduledDate: { [Op.gt]: new Date() },
          status: { [Op.in]: ['confirmed', 'pending'] }
        }
      });

      // Get completed interviews count
      const completedCount = await Interview.count({
        where: {
          userId,
          status: 'completed',
          createdAt: { [Op.gte]: startDate }
        }
      });

      // Get interview timeline
      const timeline = await Interview.findAll({
        where: {
          userId,
          createdAt: { [Op.gte]: startDate }
        },
        attributes: [
          [Interview.sequelize!.fn('DATE', Interview.sequelize!.col('scheduledDate')), 'date'],
          [Interview.sequelize!.fn('COUNT', Interview.sequelize!.col('id')), 'count']
        ],
        group: [Interview.sequelize!.fn('DATE', Interview.sequelize!.col('scheduledDate'))],
        order: [[Interview.sequelize!.fn('DATE', Interview.sequelize!.col('scheduledDate')), 'ASC']],
        raw: true
      });

      res.json({
        success: true,
        data: {
          statusStats,
          typeStats,
          upcomingCount,
          completedCount,
          timeline,
          timeframe: Number(timeframe)
        }
      });
    } catch (error) {
      console.error('Error fetching interview analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch interview analytics'
      });
    }
  }

  /**
   * Add interview notes
   */
  static async addInterviewNotes(req: Request, res: ExpressResponse) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { notes, outcome, feedback, nextSteps, followUpDate } = req.body;

      const interview = await Interview.findOne({
        where: { id, userId }
      });

      if (!interview) {
        return res.status(404).json({
          success: false,
          message: 'Interview not found'
        });
      }

      const updateData: any = {};
      
      if (notes) updateData.interviewNotes = notes;
      if (outcome) updateData.outcome = outcome;
      if (feedback) updateData.feedback = feedback;
      if (nextSteps) updateData.nextSteps = nextSteps;
      if (followUpDate) updateData.followUpDate = new Date(followUpDate);

      // Mark as completed if outcome is provided
      if (outcome && interview.status !== 'completed') {
        updateData.status = 'completed';
      }

      await interview.update(updateData);

      res.json({
        success: true,
        data: interview
      });
    } catch (error) {
      console.error('Error adding interview notes:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add interview notes'
      });
    }
  }

  /**
   * Get calendar authorization URL
   */
  static async getCalendarAuthUrl(req: Request, res: ExpressResponse) {
    try {
      const calendarService = new CalendarService();
      const authUrl = calendarService.getAuthUrl();

      res.json({
        success: true,
        data: { authUrl }
      });
    } catch (error) {
      console.error('Error getting calendar auth URL:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get calendar authorization URL'
      });
    }
  }

  /**
   * Handle calendar OAuth callback
   */
  static async handleCalendarCallback(req: Request, res: ExpressResponse) {
    try {
      const { code } = req.body;
      const userId = req.user?.id;

      const calendarService = new CalendarService();
      const credentials = await calendarService.getTokens(code);

      // TODO: Store credentials securely for the user
      // This would typically be stored in a UserCalendarCredentials table
      console.log('Calendar credentials received for user:', userId);

      res.json({
        success: true,
        message: 'Calendar connected successfully',
        data: {
          provider: 'google',
          connected: true
        }
      });
    } catch (error) {
      console.error('Error handling calendar callback:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to connect calendar'
      });
    }
  }

  /**
   * Generate email response for interview
   */
  static async generateEmailResponse(req: Request, res: ExpressResponse) {
    try {
      const {
        responseId,
        action,
        tone = 'professional',
        rescheduleOptions,
        userPreferences
      } = req.body;

      // Get the original response
      const response = await Response.findByPk(responseId, {
        include: [
          {
            model: Application,
            as: 'application',
            include: [
              {
                model: Job,
                as: 'job'
              }
            ]
          }
        ]
      });

      if (!response) {
        return res.status(404).json({
          success: false,
          message: 'Response not found'
        });
      }

      const emailResponse = await EmailResponseService.generateResponse(
        {
          subject: response.subject,
          content: response.content,
          sender: response.sender,
          senderName: response.senderName
        },
        {
          action,
          tone,
          userPreferences,
          interviewDetails: {
            company: response.application?.job?.company || '',
            position: response.application?.job?.title || '',
            interviewer: response.senderName || response.sender,
            originalDate: response.extractedData?.interviewDate?.toString(),
            originalTime: response.extractedData?.interviewTime,
            location: response.extractedData?.interviewLocation
          },
          rescheduleReason: rescheduleOptions?.reason,
          alternativeTimes: rescheduleOptions?.alternativeTimes
        }
      );

      const validation = EmailResponseService.validateEmail(emailResponse);

      res.json({
        success: true,
        data: {
          emailResponse,
          validation
        }
      });
    } catch (error) {
      console.error('Error generating email response:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate email response'
      });
    }
  }
}

export default InterviewController;