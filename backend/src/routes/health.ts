import express from 'express';

const router = express.Router();

/**
 * Health check endpoint for Cloud Run
 * Returns 200 OK if service is healthy
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'jobbuddy-backend',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * Readiness check endpoint
 * Can be extended to check database connectivity
 */
router.get('/ready', async (req, res) => {
  try {
    // Add database ping check here if needed
    // await db.query('SELECT 1');
    
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
