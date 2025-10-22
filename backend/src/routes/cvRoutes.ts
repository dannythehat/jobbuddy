import express from 'express';
import { getCVs, getCV, uploadCV, updateCV, deleteCV } from '../controllers/cvController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get all CVs for user
router.get('/', getCVs);

// Upload new CV
router.post('/', uploadCV);

// Get specific CV
router.get('/:id', getCV);

// Update CV
router.put('/:id', updateCV);

// Delete CV
router.delete('/:id', deleteCV);

export default router;