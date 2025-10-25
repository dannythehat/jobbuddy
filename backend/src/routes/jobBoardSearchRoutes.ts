// Phase 7.1.2: Job Board Search Routes
import express from 'express';
import { protect } from '../middleware/auth';
import { multiPlatformSearchService } from '../services/jobBoard/MultiPlatformSearchService';
import { JobBoardSearchParams } from '../types/jobBoard';

const router = express.Router();

/**
 * POST /api/job-boards/search
 * Search jobs across all connected platforms
 */
router.post('/search', protect, async (req, res) => {
  try {
    const params: JobBoardSearchParams = {
      query: req.body.query,
      location: req.body.location,
      country: req.body.country,
      remote: req.body.remote,
      job_type: req.body.job_type,
      salary_min: req.body.salary_min,
      salary_max: req.body.salary_max,
      posted_within_days: req.body.posted_within_days,
      include_premium: req.body.include_premium !== false,
      providers: req.body.providers
    };

    const results = await multiPlatformSearchService.searchAllPlatforms(
      req.user.id,
      params
    );

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Job board search error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search job boards'
    });
  }
});

/**
 * GET /api/job-boards/search/history
 * Get user's search history
 */
router.get('/search/history', protect, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    
    const query = `
      SELECT * FROM job_search_history
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `;
    
    const { pool } = require('../config/database');
    const result = await pool.query(query, [req.user.id, limit]);

    res.json({
      success: true,
      data: { history: result.rows }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch search history'
    });
  }
});

export default router;
