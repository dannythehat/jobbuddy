import { Router } from 'express';
import { AIController } from '../controllers/aiController';
import { EnhancedAIController } from '../controllers/enhancedAIController';
import { authenticateToken } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();
const aiController = new AIController();
const enhancedAIController = new EnhancedAIController();

// Apply authentication and rate limiting to all AI routes
router.use(authenticateToken);
router.use(rateLimiter);

// Phase 6.1 Routes - Natural Language Search & Interview Prep
router.post('/search/parse', aiController.parseJobQuery);
router.post('/interview/create', aiController.createMockInterview);
router.post('/interview/analyze', aiController.analyzeInterviewResponse);
router.post('/career/path', aiController.generateCareerPath);
router.post('/career/skills/gaps', aiController.analyzeSkillGaps);
router.get('/career/market/insights', aiController.getMarketInsights);

// Phase 6.2 Routes - Learning & Market Analysis
router.post('/learning/path', enhancedAIController.generateLearningPath);
router.post('/learning/assess', enhancedAIController.assessSkills);
router.post('/learning/resources', enhancedAIController.recommendResources);
router.post('/learning/progress', enhancedAIController.trackProgress);

router.post('/market/trends', enhancedAIController.analyzeMarketTrends);
router.post('/market/alerts', enhancedAIController.generatePersonalizedAlerts);
router.post('/market/salary/predict', enhancedAIController.predictSalaryTrends);

export default router;