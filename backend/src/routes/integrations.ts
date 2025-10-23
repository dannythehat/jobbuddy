import { Router } from 'express';
import { integrationController } from '../controllers/integrationController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * @route GET /api/integrations
 * @desc Get all user integrations
 * @access Private
 */
router.get('/', authenticateToken, integrationController.getIntegrations.bind(integrationController));

/**
 * @route GET /api/integrations/quick-setup
 * @desc Get quick setup status for onboarding
 * @access Private
 */
router.get('/quick-setup', authenticateToken, integrationController.getQuickSetupStatus.bind(integrationController));

/**
 * @route POST /api/integrations/google/calendar/connect
 * @desc Get Google Calendar authorization URL
 * @access Private
 */
router.post('/google/calendar/connect', authenticateToken, integrationController.connectGoogleCalendar.bind(integrationController));

/**
 * @route POST /api/integrations/google/gmail/connect
 * @desc Get Google Gmail authorization URL
 * @access Private
 */
router.post('/google/gmail/connect', authenticateToken, integrationController.connectGoogleGmail.bind(integrationController));

/**
 * @route GET /api/integrations/google/callback
 * @desc Handle Google OAuth callback
 * @access Public (OAuth callback)
 */
router.get('/google/callback', integrationController.handleGoogleCallback.bind(integrationController));

/**
 * @route DELETE /api/integrations/:provider
 * @desc Disconnect an integration
 * @access Private
 */
router.delete('/:provider', authenticateToken, integrationController.disconnectIntegration.bind(integrationController));

/**
 * @route POST /api/integrations/:provider/test
 * @desc Test integration connection
 * @access Private
 */
router.post('/:provider/test', authenticateToken, integrationController.testIntegration.bind(integrationController));

/**
 * @route PUT /api/integrations/:provider/settings
 * @desc Update integration settings
 * @access Private
 */
router.put('/:provider/settings', authenticateToken, integrationController.updateIntegrationSettings.bind(integrationController));

/**
 * @route POST /api/integrations/:provider/refresh
 * @desc Refresh integration tokens
 * @access Private
 */
router.post('/:provider/refresh', authenticateToken, integrationController.refreshIntegration.bind(integrationController));

/**
 * @route POST /api/integrations/health-check
 * @desc Run health check on all user integrations
 * @access Private
 */
router.post('/health-check', authenticateToken, integrationController.healthCheck.bind(integrationController));

export default router;