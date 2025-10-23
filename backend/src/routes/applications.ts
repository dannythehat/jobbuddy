import express from 'express';
import { ApplicationController } from '../controllers/applicationController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * @route GET /api/applications
 * @desc Get all applications for the authenticated user
 * @access Private
 */
router.get('/', ApplicationController.getApplications);

/**
 * @route GET /api/applications/stats
 * @desc Get application statistics for the user
 * @access Private
 */
router.get('/stats', ApplicationController.getApplicationStats);

/**
 * @route GET /api/applications/:id
 * @desc Get a specific application by ID
 * @access Private
 */
router.get('/:id', ApplicationController.getApplication);

/**
 * @route POST /api/applications
 * @desc Create a new application (draft)
 * @access Private
 * @body { jobId: string, cvId: string, notes?: string }
 */
router.post('/', ApplicationController.createApplication);

/**
 * @route POST /api/applications/generate
 * @desc Generate AI-powered application content
 * @access Private
 * @body { 
 *   jobId: string, 
 *   cvId: string, 
 *   options?: {
 *     includeCustomResume?: boolean,
 *     tone?: 'professional' | 'enthusiastic' | 'conversational' | 'formal',
 *     length?: 'short' | 'medium' | 'long',
 *     focusAreas?: string[]
 *   }
 * }
 */
router.post('/generate', ApplicationController.generateApplicationContent);

/**
 * @route POST /api/applications/generate-variations
 * @desc Generate multiple cover letter variations
 * @access Private
 * @body { jobId: string, cvId: string, count?: number }
 */
router.post('/generate-variations', ApplicationController.generateCoverLetterVariations);

/**
 * @route PUT /api/applications/:id
 * @desc Update an application
 * @access Private
 * @body { 
 *   status?: string,
 *   coverLetter?: string,
 *   notes?: string,
 *   submissionDate?: Date,
 *   responseDate?: Date,
 *   responseType?: string,
 *   interviewDate?: Date,
 *   interviewNotes?: string,
 *   offerDetails?: object
 * }
 */
router.put('/:id', ApplicationController.updateApplication);

/**
 * @route POST /api/applications/:id/optimize
 * @desc Optimize application based on feedback
 * @access Private
 * @body { feedback: string }
 */
router.post('/:id/optimize', ApplicationController.optimizeApplication);

/**
 * @route DELETE /api/applications/:id
 * @desc Delete an application
 * @access Private
 */
router.delete('/:id', ApplicationController.deleteApplication);

export default router;