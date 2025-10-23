import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * @route GET /api/analytics
 * @desc Get comprehensive analytics data
 * @access Private
 * @query timeRange - 1month, 3months, 6months, 1year (default: 6months)
 */
router.get('/', analyticsController.getAnalytics.bind(analyticsController));

/**
 * @route GET /api/analytics/overview
 * @desc Get overview metrics, goals, and predictions
 * @access Private
 * @query timeRange - 1month, 3months, 6months, 1year (default: 6months)
 */
router.get('/overview', analyticsController.getOverview.bind(analyticsController));

/**
 * @route GET /api/analytics/trends
 * @desc Get trend data and historical analysis
 * @access Private
 * @query timeRange - 1month, 3months, 6months, 1year (default: 6months)
 */
router.get('/trends', analyticsController.getTrends.bind(analyticsController));

/**
 * @route GET /api/analytics/performance
 * @desc Get performance metrics and conversion rates
 * @access Private
 * @query timeRange - 1month, 3months, 6months, 1year (default: 6months)
 */
router.get('/performance', analyticsController.getPerformance.bind(analyticsController));

/**
 * @route GET /api/analytics/insights
 * @desc Get AI-generated insights and recommendations
 * @access Private
 * @query timeRange - 1month, 3months, 6months, 1year (default: 6months)
 */
router.get('/insights', analyticsController.getInsights.bind(analyticsController));

/**
 * @route GET /api/analytics/recommendations
 * @desc Get personalized recommendations for improvement
 * @access Private
 * @query timeRange - 1month, 3months, 6months, 1year (default: 6months)
 */
router.get('/recommendations', analyticsController.getRecommendations.bind(analyticsController));

/**
 * @route GET /api/analytics/export
 * @desc Export analytics data in various formats
 * @access Private
 * @query timeRange - 1month, 3months, 6months, 1year (default: 6months)
 * @query format - json, csv (default: json)
 */
router.get('/export', analyticsController.exportAnalytics.bind(analyticsController));

export default router;