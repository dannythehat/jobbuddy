import { Router } from 'express';
import { InterviewController } from '../controllers/interviewController';
import { authenticateToken } from '../middleware/auth';
import { body, param, query } from 'express-validator';
import { validateRequest } from '../middleware/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

/**
 * GET /api/interviews
 * Get all interviews for the authenticated user with filtering and pagination
 */
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('status').optional().isIn([
      'pending', 'confirmed', 'rescheduled', 'cancelled', 'completed', 'no_show'
    ]).withMessage('Invalid status'),
    query('upcoming').optional().isBoolean().withMessage('Upcoming must be a boolean'),
    query('past').optional().isBoolean().withMessage('Past must be a boolean'),
    query('search').optional().isString().withMessage('Search must be a string'),
    query('sortBy').optional().isIn([
      'scheduledDate', 'title', 'status', 'type', 'createdAt'
    ]).withMessage('Invalid sortBy field'),
    query('sortOrder').optional().isIn(['ASC', 'DESC']).withMessage('SortOrder must be ASC or DESC'),
    validateRequest
  ],
  InterviewController.getInterviews
);

/**
 * GET /api/interviews/upcoming
 * Get upcoming interviews for the authenticated user
 */
router.get(
  '/upcoming',
  [
    query('days').optional().isInt({ min: 1, max: 365 }).withMessage('Days must be between 1 and 365'),
    validateRequest
  ],
  InterviewController.getUpcomingInterviews
);

/**
 * GET /api/interviews/analytics
 * Get interview analytics and statistics
 */
router.get(
  '/analytics',
  [
    query('timeframe').optional().isInt({ min: 1, max: 365 }).withMessage('Timeframe must be between 1 and 365 days'),
    validateRequest
  ],
  InterviewController.getInterviewAnalytics
);

/**
 * POST /api/interviews/schedule
 * Schedule interview from response
 */
router.post(
  '/schedule',
  [
    body('responseId').isUUID().withMessage('Response ID must be a valid UUID'),
    body('userAction').isIn(['accept', 'decline', 'reschedule']).withMessage('Invalid user action'),
    body('rescheduleOptions').optional().isObject().withMessage('Reschedule options must be an object'),
    body('rescheduleOptions.reason').optional().isString().withMessage('Reschedule reason must be a string'),
    body('rescheduleOptions.alternativeTimes').optional().isArray().withMessage('Alternative times must be an array'),
    body('calendarPreferences').optional().isObject().withMessage('Calendar preferences must be an object'),
    body('calendarPreferences.provider').optional().isIn(['google', 'outlook', 'apple']).withMessage('Invalid calendar provider'),
    body('userPreferences').optional().isObject().withMessage('User preferences must be an object'),
    body('userPreferences.name').optional().isString().withMessage('User name must be a string'),
    body('userPreferences.timezone').optional().isString().withMessage('Timezone must be a string'),
    validateRequest
  ],
  InterviewController.scheduleInterview
);

/**
 * POST /api/interviews/generate-response
 * Generate email response for interview
 */
router.post(
  '/generate-response',
  [
    body('responseId').isUUID().withMessage('Response ID must be a valid UUID'),
    body('action').isIn(['accept', 'decline', 'reschedule']).withMessage('Invalid action'),
    body('tone').optional().isIn(['professional', 'enthusiastic', 'formal', 'friendly']).withMessage('Invalid tone'),
    body('rescheduleOptions').optional().isObject().withMessage('Reschedule options must be an object'),
    body('userPreferences').optional().isObject().withMessage('User preferences must be an object'),
    validateRequest
  ],
  InterviewController.generateEmailResponse
);

/**
 * GET /api/interviews/calendar/auth-url
 * Get calendar authorization URL
 */
router.get(
  '/calendar/auth-url',
  InterviewController.getCalendarAuthUrl
);

/**
 * POST /api/interviews/calendar/callback
 * Handle calendar OAuth callback
 */
router.post(
  '/calendar/callback',
  [
    body('code').notEmpty().withMessage('Authorization code is required'),
    validateRequest
  ],
  InterviewController.handleCalendarCallback
);

/**
 * GET /api/interviews/:id
 * Get a specific interview by ID
 */
router.get(
  '/:id',
  [
    param('id').isUUID().withMessage('Interview ID must be a valid UUID'),
    validateRequest
  ],
  InterviewController.getInterview
);

/**
 * PUT /api/interviews/:id
 * Update interview details
 */
router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('Interview ID must be a valid UUID'),
    body('title').optional().isString().withMessage('Title must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('scheduledDate').optional().isISO8601().withMessage('Scheduled date must be a valid ISO 8601 date'),
    body('duration').optional().isInt({ min: 15, max: 480 }).withMessage('Duration must be between 15 and 480 minutes'),
    body('timezone').optional().isString().withMessage('Timezone must be a string'),
    body('location').optional().isString().withMessage('Location must be a string'),
    body('meetingUrl').optional().isURL().withMessage('Meeting URL must be a valid URL'),
    body('type').optional().isIn(['phone', 'video', 'in_person', 'panel', 'technical', 'behavioral']).withMessage('Invalid interview type'),
    body('format').optional().isIn(['one_on_one', 'panel', 'group', 'presentation', 'technical_test']).withMessage('Invalid interview format'),
    body('status').optional().isIn(['pending', 'confirmed', 'rescheduled', 'cancelled', 'completed', 'no_show']).withMessage('Invalid status'),
    body('interviewers').optional().isArray().withMessage('Interviewers must be an array'),
    body('preparationNotes').optional().isString().withMessage('Preparation notes must be a string'),
    body('reminders').optional().isArray().withMessage('Reminders must be an array'),
    validateRequest
  ],
  InterviewController.updateInterview
);

/**
 * POST /api/interviews/:id/cancel
 * Cancel interview
 */
router.post(
  '/:id/cancel',
  [
    param('id').isUUID().withMessage('Interview ID must be a valid UUID'),
    body('reason').optional().isString().withMessage('Reason must be a string'),
    body('sendNotification').optional().isBoolean().withMessage('Send notification must be a boolean'),
    validateRequest
  ],
  InterviewController.cancelInterview
);

/**
 * POST /api/interviews/:id/notes
 * Add interview notes and outcome
 */
router.post(
  '/:id/notes',
  [
    param('id').isUUID().withMessage('Interview ID must be a valid UUID'),
    body('notes').optional().isString().withMessage('Notes must be a string'),
    body('outcome').optional().isIn(['positive', 'negative', 'neutral', 'pending']).withMessage('Invalid outcome'),
    body('feedback').optional().isString().withMessage('Feedback must be a string'),
    body('nextSteps').optional().isString().withMessage('Next steps must be a string'),
    body('followUpDate').optional().isISO8601().withMessage('Follow up date must be a valid ISO 8601 date'),
    validateRequest
  ],
  InterviewController.addInterviewNotes
);

export default router;