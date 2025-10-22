import express from 'express';
import { getProfile, updateProfile, deleteAccount } from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get user profile
router.get('/profile', getProfile);

// Update user profile
router.put('/profile', updateProfile);

// Delete user account
router.delete('/account', deleteAccount);

export default router;