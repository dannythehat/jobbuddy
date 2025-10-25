// Phase 7.1: OAuth Callback Routes
import express from 'express';
import { jobBoardOAuthService } from '../services/jobBoardOAuthService';
import { jobBoardConnectionService } from '../services/jobBoardConnectionService';
import { pool } from '../config/database';

const router = express.Router();

/**
 * GET /api/oauth/:provider/callback
 * Handle OAuth callback from job board providers
 */
router.get('/:provider/callback', async (req, res) => {
  try {
    const { provider } = req.params;
    const { code, state, error } = req.query;

    // Handle OAuth error
    if (error) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/settings/connections?error=${error}`
      );
    }

    if (!code || !state) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/settings/connections?error=missing_parameters`
      );
    }

    // Verify state parameter
    let stateData;
    try {
      stateData = jobBoardOAuthService.verifyState(state as string);
    } catch (error) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/settings/connections?error=invalid_state`
      );
    }

    // Exchange code for token
    const tokenData = await jobBoardOAuthService.exchangeCodeForToken(
      provider,
      code as string
    );

    // Get provider ID
    const providerQuery = `
      SELECT id FROM job_board_providers WHERE name = $1
    `;
    const providerResult = await pool.query(providerQuery, [provider]);
    
    if (providerResult.rows.length === 0) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/settings/connections?error=provider_not_found`
      );
    }

    const providerId = providerResult.rows[0].id;

    // Create connection
    await jobBoardConnectionService.createConnection(
      stateData.userId,
      providerId,
      tokenData.access_token,
      tokenData.refresh_token || null,
      tokenData.expires_in
    );

    // Redirect to success page
    res.redirect(
      `${process.env.FRONTEND_URL}/settings/connections?success=true&provider=${provider}`
    );
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(
      `${process.env.FRONTEND_URL}/settings/connections?error=connection_failed`
    );
  }
});

/**
 * GET /api/oauth/status
 * Check OAuth connection status (for polling)
 */
router.get('/status', async (req, res) => {
  try {
    const { userId, provider } = req.query;

    if (!userId || !provider) {
      return res.status(400).json({
        success: false,
        error: 'Missing parameters'
      });
    }

    const query = `
      SELECT 
        c.connection_status,
        c.created_at,
        p.display_name
      FROM user_job_board_connections c
      JOIN job_board_providers p ON c.provider_id = p.id
      WHERE c.user_id = $1 AND p.name = $2
      ORDER BY c.created_at DESC
      LIMIT 1
    `;

    const result = await pool.query(query, [userId, provider]);

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: { connected: false }
      });
    }

    const connection = result.rows[0];
    res.json({
      success: true,
      data: {
        connected: connection.connection_status === 'active',
        status: connection.connection_status,
        provider: connection.display_name,
        connected_at: connection.created_at
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to check status'
    });
  }
});

export default router;
