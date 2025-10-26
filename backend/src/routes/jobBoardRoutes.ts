// Phase 7.1: Job Board Connection Routes
import express from 'express';
import { protect } from '../middleware/auth';
import { jobBoardOAuthService } from '../services/jobBoardOAuthService';
import { jobBoardConnectionService } from '../services/jobBoardConnectionService';
import { JobBoardSyncService } from '../services/jobBoardSyncService';
import { pool } from '../config/database';

const router = express.Router();
const syncService = new JobBoardSyncService();

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

router.delete('/connections/:connectionId', protect, async (req, res) => {
  try {
    const { connectionId } = req.params;
    
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

router.post('/connections/:connectionId/refresh', protect, async (req, res) => {
  try {
    const { connectionId } = req.params;
    
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

// Phase 7.1.1: Job Sync Endpoints
router.post('/sync/:connectionId', protect, async (req, res) => {
  try {
    const { connectionId } = req.params;
    const searchParams = req.body;
    
    const connection = await jobBoardConnectionService.getConnection(connectionId);
    if (!connection || connection.user_id !== req.user.id) {
      return res.status(404).json({
        success: false,
        error: 'Connection not found'
      });
    }
    
    const result = await syncService.syncJobsFromProvider(
      connectionId,
      connection.provider_id,
      connection.access_token,
      searchParams
    );
    
    res.json({
      success: result.success,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to sync jobs'
    });
  }
});

router.post('/sync-all', protect, async (req, res) => {
  try {
    const searchParams = req.body;
    const result = await syncService.syncJobsForUser(req.user.id, searchParams);
    
    res.json({
      success: result.success,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to sync jobs'
    });
  }
});

export default router;
