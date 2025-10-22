import express from 'express';
import { 
  getMatchedJobs, 
  getAllJobs, 
  getJob, 
  createSampleJobs, 
  getJobStats 
} from '../controllers/jobController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get matched jobs for user
router.get('/matches', getMatchedJobs);

// Get all jobs with filtering
router.get('/', getAllJobs);

// Get job statistics
router.get('/stats', getJobStats);

// Create sample jobs (development only)
router.post('/sample', createSampleJobs);

// Get specific job
router.get('/:id', getJob);

export default router;