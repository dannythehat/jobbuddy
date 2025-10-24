import express from 'express';
import EnhancedJobController from '../controllers/enhancedJobController';

const router = express.Router();
const enhancedJobController = new EnhancedJobController();

// Natural language job search routes
router.post('/search/natural', (req, res) => {
  enhancedJobController.naturalLanguageSearch(req, res);
});

// Parse natural language query without searching
router.post('/search/parse', (req, res) => {
  enhancedJobController.parseQuery(req, res);
});

// Get search suggestions and examples
router.get('/search/suggestions', (req, res) => {
  enhancedJobController.getSearchSuggestions(req, res);
});

export default router;