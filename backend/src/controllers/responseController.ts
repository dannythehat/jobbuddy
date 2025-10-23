import { Request, Response as ExpressResponse } from 'express';
import { Response } from '../models/Response';
import { Application } from '../models/Application';
import { Job } from '../models/Job';
import { User } from '../models/User';
import ResponseClassificationService from '../services/responseClassificationService';
import { Op } from 'sequelize';

export class ResponseController {
  /**
   * Get all responses for a user with filtering and pagination
   */
  static async getResponses(req: Request, res: ExpressResponse) {
    try {
      const userId = req.user?.id;
      const {
        page = 1,
        limit = 20,
        classification,
        processed,
        actionRequired,
        applicationId,
        search,
        sortBy = 'receivedDate',
        sortOrder = 'DESC'
      } = req.query;

      const offset = (Number(page) - 1) * Number(limit);
      
      // Build where clause
      const whereClause: any = { userId };
      
      if (classification) {
        whereClause.classification = classification;
      }
      
      if (processed !== undefined) {
        whereClause.processed = processed === 'true';
      }
      
      if (actionRequired !== undefined) {
        whereClause.actionRequired = actionRequired === 'true';
      }
      
      if (applicationId) {
        whereClause.applicationId = applicationId;
      }
      
      if (search) {
        whereClause[Op.or] = [
          { subject: { [Op.iLike]: `%${search}%` } },
          { sender: { [Op.iLike]: `%${search}%` } },
          { content: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { rows: responses, count } = await Response.findAndCountAll({
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
          }
        ],
        order: [[sortBy as string, sortOrder as string]],
        limit: Number(limit),
        offset,
      });

      res.json({
        success: true,
        data: {
          responses,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: count,
            pages: Math.ceil(count / Number(limit))
          }
        }
      });
    } catch (error) {
      console.error('Error fetching responses:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch responses'
      });
    }
  }

  /**
   * Get a specific response by ID
   */
  static async getResponse(req: Request, res: ExpressResponse) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const response = await Response.findOne({
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

      if (!response) {
        return res.status(404).json({
          success: false,
          message: 'Response not found'
        });
      }

      res.json({
        success: true,
        data: response
      });
    } catch (error) {
      console.error('Error fetching response:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch response'
      });
    }
  }

  /**
   * Manually add a response (for testing or manual entry)
   */
  static async createResponse(req: Request, res: ExpressResponse) {
    try {
      const userId = req.user?.id;
      const {
        applicationId,
        subject,
        sender,
        senderName,
        recipient,
        receivedDate,
        content,
        htmlContent
      } = req.body;

      // Verify application belongs to user
      const application = await Application.findOne({
        where: { id: applicationId, userId },
        include: [{ model: Job, as: 'job' }]
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }

      // Classify the response using AI
      const classification = await ResponseClassificationService.classifyResponse(
        subject,
        content,
        senderName,
        application.job?.title,
        application.job?.company
      );

      // Create the response
      const response = await Response.create({
        applicationId,
        subject,
        sender,
        senderName,
        recipient,
        receivedDate: new Date(receivedDate),
        content,
        htmlContent,
        classification: classification.classification,
        confidence: classification.confidence,
        sentiment: classification.sentiment,
        sentimentScore: classification.sentimentScore,
        extractedData: classification.extractedData,
        actionRequired: classification.actionRequired,
        userId
      });

      res.status(201).json({
        success: true,
        data: response,
        classification
      });
    } catch (error) {
      console.error('Error creating response:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create response'
      });
    }
  }

  /**
   * Update response processing status and actions
   */
  static async updateResponse(req: Request, res: ExpressResponse) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const {
        processed,
        processingNotes,
        actionTaken,
        actionRequired,
        classification,
        extractedData
      } = req.body;

      const response = await Response.findOne({
        where: { id, userId }
      });

      if (!response) {
        return res.status(404).json({
          success: false,
          message: 'Response not found'
        });
      }

      const updateData: any = {};
      
      if (processed !== undefined) {
        updateData.processed = processed;
        if (processed) {
          updateData.processingDate = new Date();
        }
      }
      
      if (processingNotes) {
        updateData.processingNotes = processingNotes;
      }
      
      if (actionTaken) {
        updateData.actionTaken = actionTaken;
        updateData.actionDate = new Date();
      }
      
      if (actionRequired !== undefined) {
        updateData.actionRequired = actionRequired;
      }
      
      if (classification) {
        updateData.classification = classification;
      }
      
      if (extractedData) {
        updateData.extractedData = { ...response.extractedData, ...extractedData };
      }

      await response.update(updateData);

      res.json({
        success: true,
        data: response
      });
    } catch (error) {
      console.error('Error updating response:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update response'
      });
    }
  }

  /**
   * Delete a response
   */
  static async deleteResponse(req: Request, res: ExpressResponse) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const response = await Response.findOne({
        where: { id, userId }
      });

      if (!response) {
        return res.status(404).json({
          success: false,
          message: 'Response not found'
        });
      }

      await response.destroy();

      res.json({
        success: true,
        message: 'Response deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting response:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete response'
      });
    }
  }

  /**
   * Reclassify a response using AI
   */
  static async reclassifyResponse(req: Request, res: ExpressResponse) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const response = await Response.findOne({
        where: { id, userId },
        include: [
          {
            model: Application,
            as: 'application',
            include: [{ model: Job, as: 'job' }]
          }
        ]
      });

      if (!response) {
        return res.status(404).json({
          success: false,
          message: 'Response not found'
        });
      }

      // Reclassify using AI
      const classification = await ResponseClassificationService.classifyResponse(
        response.subject,
        response.content,
        response.senderName,
        response.application?.job?.title,
        response.application?.job?.company
      );

      // Update the response
      await response.update({
        classification: classification.classification,
        confidence: classification.confidence,
        sentiment: classification.sentiment,
        sentimentScore: classification.sentimentScore,
        extractedData: classification.extractedData,
        actionRequired: classification.actionRequired,
        processed: false, // Mark as unprocessed since classification changed
      });

      res.json({
        success: true,
        data: response,
        classification
      });
    } catch (error) {
      console.error('Error reclassifying response:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reclassify response'
      });
    }
  }

  /**
   * Get response analytics and statistics
   */
  static async getResponseAnalytics(req: Request, res: ExpressResponse) {
    try {
      const userId = req.user?.id;
      const { timeframe = '30' } = req.query; // days

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - Number(timeframe));

      // Get response counts by classification
      const classificationStats = await Response.findAll({
        where: {
          userId,
          receivedDate: { [Op.gte]: startDate }
        },
        attributes: [
          'classification',
          [Response.sequelize!.fn('COUNT', Response.sequelize!.col('id')), 'count']
        ],
        group: ['classification'],
        raw: true
      });

      // Get sentiment distribution
      const sentimentStats = await Response.findAll({
        where: {
          userId,
          receivedDate: { [Op.gte]: startDate }
        },
        attributes: [
          'sentiment',
          [Response.sequelize!.fn('COUNT', Response.sequelize!.col('id')), 'count']
        ],
        group: ['sentiment'],
        raw: true
      });

      // Get processing status
      const processingStats = await Response.findAll({
        where: {
          userId,
          receivedDate: { [Op.gte]: startDate }
        },
        attributes: [
          'processed',
          [Response.sequelize!.fn('COUNT', Response.sequelize!.col('id')), 'count']
        ],
        group: ['processed'],
        raw: true
      });

      // Get action required count
      const actionRequiredCount = await Response.count({
        where: {
          userId,
          actionRequired: true,
          processed: false,
          receivedDate: { [Op.gte]: startDate }
        }
      });

      // Get response timeline (daily counts)
      const timeline = await Response.findAll({
        where: {
          userId,
          receivedDate: { [Op.gte]: startDate }
        },
        attributes: [
          [Response.sequelize!.fn('DATE', Response.sequelize!.col('receivedDate')), 'date'],
          [Response.sequelize!.fn('COUNT', Response.sequelize!.col('id')), 'count']
        ],
        group: [Response.sequelize!.fn('DATE', Response.sequelize!.col('receivedDate'))],
        order: [[Response.sequelize!.fn('DATE', Response.sequelize!.col('receivedDate')), 'ASC']],
        raw: true
      });

      res.json({
        success: true,
        data: {
          classificationStats,
          sentimentStats,
          processingStats,
          actionRequiredCount,
          timeline,
          timeframe: Number(timeframe)
        }
      });
    } catch (error) {
      console.error('Error fetching response analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch response analytics'
      });
    }
  }

  /**
   * Batch process unprocessed responses
   */
  static async batchProcessResponses(req: Request, res: ExpressResponse) {
    try {
      const userId = req.user?.id;
      const { limit = 50 } = req.query;

      // Get unprocessed responses
      const responses = await Response.findAll({
        where: {
          userId,
          processed: false
        },
        include: [
          {
            model: Application,
            as: 'application',
            include: [{ model: Job, as: 'job' }]
          }
        ],
        limit: Number(limit),
        order: [['receivedDate', 'ASC']]
      });

      const processedCount = responses.length;
      const results = [];

      for (const response of responses) {
        try {
          // Reclassify if confidence is low
          if (response.confidence < 0.7) {
            const classification = await ResponseClassificationService.classifyResponse(
              response.subject,
              response.content,
              response.senderName,
              response.application?.job?.title,
              response.application?.job?.company
            );

            await response.update({
              classification: classification.classification,
              confidence: classification.confidence,
              sentiment: classification.sentiment,
              sentimentScore: classification.sentimentScore,
              extractedData: classification.extractedData,
              actionRequired: classification.actionRequired,
            });
          }

          // Mark as processed
          await response.update({
            processed: true,
            processingDate: new Date(),
            processingNotes: 'Batch processed'
          });

          results.push({
            id: response.id,
            classification: response.classification,
            confidence: response.confidence,
            actionRequired: response.actionRequired
          });

        } catch (error) {
          console.error(`Error processing response ${response.id}:`, error);
          results.push({
            id: response.id,
            error: 'Processing failed'
          });
        }
      }

      res.json({
        success: true,
        data: {
          processedCount,
          results
        }
      });
    } catch (error) {
      console.error('Error batch processing responses:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to batch process responses'
      });
    }
  }
}

export default ResponseController;