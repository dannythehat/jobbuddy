import { Router } from 'express';
import { AIController } from '../controllers/aiController';
import { authenticateToken } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();
const aiController = new AIController();

// Apply authentication and rate limiting to all AI routes
router.use(authenticateToken);
router.use(rateLimiter);

// Natural Language Search Routes
router.post('/search/parse', aiController.parseJobQuery);

// Interview Preparation Routes
router.post('/interview/create', aiController.createMockInterview);
router.post('/interview/analyze', aiController.analyzeInterviewResponse);

// Career Intelligence Routes
router.post('/career/path', aiController.generateCareerPath);
router.post('/career/skills/gaps', aiController.analyzeSkillGaps);
router.get('/career/market/insights', aiController.getMarketInsights);

export default router;