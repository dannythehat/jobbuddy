import express from 'express';
import { register, login, getMe, logout } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Get current user route (protected)
router.get('/me', protect, getMe);

// Logout route
router.get('/logout', logout);

export default router;