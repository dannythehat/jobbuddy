// Phase 7.1: Job Board Connection Routes
import express from 'express';
import { protect } from '../middleware/auth';
import { jobBoardOAuthService } from '../services/jobBoardOAuthService';
import { jobBoardConnectionService } from '../services/jobBoardConnectionService';
import { pool } from '../config/database';

const router = express.Router();

/**
 * GET /api/job-boards/providers
 * Get list of available job board providers
 */
router.get('/providers', protect, async (req, res) => {
  try {
    const query = `
      SELECT 
        id, name, display_name, logo_url, website_url,
        is_premium, supported_countries, description, is_active
      FROM job_board_providers
      WHERE is_active = true
      ORDER BY display_name
    `;
    
    const result = await pool.query(query);
    
    res.json({
      success: true,
      data: {
        providers: result.rows,
        configured: jobBoardOAuthService.getConfiguredProviders()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch job board providers'
    });
  }
});

/**
 * GET /api/job-boards/connections
 * Get user's job board connections
 */
router.get('/connections', protect, async (req, res) => {
  try {
    const connections = await jobBoardConnectionService.getUserConnections(req.user.id);
    
    res.json({
      success: true,
      data: { connections }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch connections'
    });
  }
});

/**
 * GET /api/job-boards/connections/health
 * Check health of all connections
 */
router.get('/connections/health', protect, async (req, res) => {
  try {
    const health = await jobBoardConnectionService.checkConnectionHealth(req.user.id);
    
    res.json({
      success: true,
      data: { health }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to check connection health'
    });
  }
});

/**
 * POST /api/job-boards/connect/:provider
 * Initiate OAuth connection to job board
 */
router.post('/connect/:provider', protect, async (req, res) => {
  try {
    const { provider } = req.params;
    
    if (!jobBoardOAuthService.isProviderConfigured(provider)) {
      return res.status(400).json({
        success: false,
        error: `Provider ${provider} is not configured`
      });
    }
    
    const authUrl = jobBoardOAuthService.getAuthorizationUrl(provider, req.user.id);
    
    res.json({
      success: true,
      data: { authorization_url: authUrl }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to initiate connection'
    });
  }
});

/**
 * DELETE /api/job-boards/connections/:connectionId
 * Disconnect job board
 */
router.delete('/connections/:connectionId', protect, async (req, res) => {
  try {
    const { connectionId } = req.params;
    
    // Verify connection belongs to user
    const connection = await jobBoardConnectionService.getConnection(connectionId);
    if (!connection || connection.user_id !== req.user.id) {
      return res.status(404).json({
        success: false,
        error: 'Connection not found'
      });
    }
    
    await jobBoardConnectionService.disconnectConnection(connectionId);
    
    res.json({
      success: true,
      message: 'Connection disconnected successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to disconnect'
    });
  }
});

/**
 * POST /api/job-boards/connections/:connectionId/refresh
 * Refresh connection token
 */
router.post('/connections/:connectionId/refresh', protect, async (req, res) => {
  try {
    const { connectionId } = req.params;
    
    // Verify connection belongs to user
    const connection = await jobBoardConnectionService.getConnection(connectionId);
    if (!connection || connection.user_id !== req.user.id) {
      return res.status(404).json({
        success: false,
        error: 'Connection not found'
      });
    }
    
    await jobBoardConnectionService.refreshConnection(connectionId);
    
    res.json({
      success: true,
      message: 'Connection refreshed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to refresh connection'
    });
  }
});

export default router;
