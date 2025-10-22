import express from 'express';
import { getCVs, getCV, uploadCV, updateCV, deleteCV, getCVParsingStatus } from '../controllers/cvController';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get all CVs for user
router.get('/', getCVs);

// Upload new CV with file upload middleware
router.post('/', upload.single('cv'), uploadCV);

// Get specific CV
router.get('/:id', getCV);

// Get CV parsing status
router.get('/:id/status', getCVParsingStatus);

// Update CV
router.put('/:id', updateCV);

// Delete CV
router.delete('/:id', deleteCV);

export default router;