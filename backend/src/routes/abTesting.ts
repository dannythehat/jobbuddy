import { Router } from 'express';
import { abTestingController } from '../controllers/abTestingController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * @route POST /api/ab-tests
 * @desc Create a new A/B test
 * @access Private
 */
router.post('/', abTestingController.createTest.bind(abTestingController));

/**
 * @route GET /api/ab-tests
 * @desc Get user's A/B tests
 * @access Private
 */
router.get('/', abTestingController.getUserTests.bind(abTestingController));

/**
 * @route GET /api/ab-tests/active
 * @desc Get active A/B tests for user
 * @access Private
 * @query type - Filter by test type (optional)
 */
router.get('/active', abTestingController.getActiveTests.bind(abTestingController));

/**
 * @route GET /api/ab-tests/templates
 * @desc Get A/B test templates
 * @access Private
 */
router.get('/templates', abTestingController.getTestTemplates.bind(abTestingController));

/**
 * @route POST /api/ab-tests/from-template
 * @desc Create A/B test from template
 * @access Private
 */
router.post('/from-template', abTestingController.createFromTemplate.bind(abTestingController));

/**
 * @route POST /api/ab-tests/:testId/start
 * @desc Start an A/B test
 * @access Private
 */
router.post('/:testId/start', abTestingController.startTest.bind(abTestingController));

/**
 * @route POST /api/ab-tests/:testId/pause
 * @desc Pause an A/B test
 * @access Private
 */
router.post('/:testId/pause', abTestingController.pauseTest.bind(abTestingController));

/**
 * @route POST /api/ab-tests/:testId/complete
 * @desc Complete an A/B test
 * @access Private
 */
router.post('/:testId/complete', abTestingController.completeTest.bind(abTestingController));

/**
 * @route POST /api/ab-tests/:testId/assign
 * @desc Assign user to a variant
 * @access Private
 */
router.post('/:testId/assign', abTestingController.assignVariant.bind(abTestingController));

/**
 * @route POST /api/ab-tests/:testId/convert
 * @desc Record a conversion event
 * @access Private
 */
router.post('/:testId/convert', abTestingController.recordConversion.bind(abTestingController));

/**
 * @route GET /api/ab-tests/:testId/analyze
 * @desc Analyze A/B test results
 * @access Private
 */
router.get('/:testId/analyze', abTestingController.analyzeTest.bind(abTestingController));

/**
 * @route GET /api/ab-tests/:testId/results
 * @desc Get A/B test results
 * @access Private
 */
router.get('/:testId/results', abTestingController.getTestResults.bind(abTestingController));

export default router;