import { Router } from 'express';
import { ResponseController } from '../controllers/responseController';
import { authenticateToken } from '../middleware/auth';
import { body, param, query } from 'express-validator';
import { validateRequest } from '../middleware/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

/**
 * GET /api/responses
 * Get all responses for the authenticated user with filtering and pagination
 */
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('classification').optional().isIn([
      'interview_invite', 'rejection', 'request_info', 'acknowledgment', 'offer', 'follow_up', 'other'
    ]).withMessage('Invalid classification'),
    query('processed').optional().isBoolean().withMessage('Processed must be a boolean'),
    query('actionRequired').optional().isBoolean().withMessage('ActionRequired must be a boolean'),
    query('applicationId').optional().isUUID().withMessage('ApplicationId must be a valid UUID'),
    query('search').optional().isString().withMessage('Search must be a string'),
    query('sortBy').optional().isIn([
      'receivedDate', 'classification', 'confidence', 'sentiment', 'processed', 'actionRequired'
    ]).withMessage('Invalid sortBy field'),
    query('sortOrder').optional().isIn(['ASC', 'DESC']).withMessage('SortOrder must be ASC or DESC'),
    validateRequest
  ],
  ResponseController.getResponses
);

/**
 * GET /api/responses/analytics
 * Get response analytics and statistics
 */
router.get(
  '/analytics',
  [
    query('timeframe').optional().isInt({ min: 1, max: 365 }).withMessage('Timeframe must be between 1 and 365 days'),
    validateRequest
  ],
  ResponseController.getResponseAnalytics
);

/**
 * POST /api/responses/batch-process
 * Batch process unprocessed responses
 */
router.post(
  '/batch-process',
  [
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    validateRequest
  ],
  ResponseController.batchProcessResponses
);

/**
 * GET /api/responses/:id
 * Get a specific response by ID
 */
router.get(
  '/:id',
  [
    param('id').isUUID().withMessage('Response ID must be a valid UUID'),
    validateRequest
  ],
  ResponseController.getResponse
);

/**
 * POST /api/responses
 * Create a new response (manual entry or testing)
 */
router.post(
  '/',
  [
    body('applicationId').isUUID().withMessage('Application ID must be a valid UUID'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('sender').isEmail().withMessage('Sender must be a valid email'),
    body('senderName').optional().isString().withMessage('Sender name must be a string'),
    body('recipient').isEmail().withMessage('Recipient must be a valid email'),
    body('receivedDate').isISO8601().withMessage('Received date must be a valid ISO 8601 date'),
    body('content').notEmpty().withMessage('Content is required'),
    body('htmlContent').optional().isString().withMessage('HTML content must be a string'),
    validateRequest
  ],
  ResponseController.createResponse
);

/**
 * PUT /api/responses/:id
 * Update response processing status and actions
 */
router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('Response ID must be a valid UUID'),
    body('processed').optional().isBoolean().withMessage('Processed must be a boolean'),
    body('processingNotes').optional().isString().withMessage('Processing notes must be a string'),
    body('actionTaken').optional().isString().withMessage('Action taken must be a string'),
    body('actionRequired').optional().isBoolean().withMessage('Action required must be a boolean'),
    body('classification').optional().isIn([
      'interview_invite', 'rejection', 'request_info', 'acknowledgment', 'offer', 'follow_up', 'other'
    ]).withMessage('Invalid classification'),
    body('extractedData').optional().isObject().withMessage('Extracted data must be an object'),
    validateRequest
  ],
  ResponseController.updateResponse
);

/**
 * POST /api/responses/:id/reclassify
 * Reclassify a response using AI
 */
router.post(
  '/:id/reclassify',
  [
    param('id').isUUID().withMessage('Response ID must be a valid UUID'),
    validateRequest
  ],
  ResponseController.reclassifyResponse
);

/**
 * DELETE /api/responses/:id
 * Delete a response
 */
router.delete(
  '/:id',
  [
    param('id').isUUID().withMessage('Response ID must be a valid UUID'),
    validateRequest
  ],
  ResponseController.deleteResponse
);

export default router;