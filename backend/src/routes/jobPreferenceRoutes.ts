import express from 'express';
import { 
  getJobPreferences, 
  upsertJobPreferences, 
  generatePreferencesFromCV, 
  deleteJobPreferences 
} from '../controllers/jobPreferenceController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get user's job preferences
router.get('/', getJobPreferences);

// Create or update job preferences
router.post('/', upsertJobPreferences);

// Generate preferences from CV
router.post('/generate', generatePreferencesFromCV);

// Delete job preferences
router.delete('/', deleteJobPreferences);

export default router;