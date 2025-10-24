import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';

// Import consolidated routes
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import jobsRoutes from './routes/jobsRoutes';
import automationRoutes from './routes/automationRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import naturalLanguageRoutes from './routes/naturalLanguageRoutes';

// Create Express app
const app = express();

// Essential middleware stack
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies
app.use(compression()); // Compress responses
app.use(morgan('combined')); // Logging

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Increased limit for consolidated endpoints
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many requests, please try again later.'
  }
});
app.use('/api', limiter);

// Consolidated API Routes (Phase 6.1: Added Natural Language)
app.use('/api/auth', authRoutes);           // Authentication
app.use('/api/profile', profileRoutes);     // Users + CVs + Certificates
app.use('/api/jobs', jobsRoutes);           // Jobs + Preferences + Applications
app.use('/api/automation', automationRoutes); // Responses + Interviews
app.use('/api/analytics', analyticsRoutes);  // Dashboard + Insights
app.use('/api/nl', naturalLanguageRoutes);   // Phase 6.1: Natural Language Search

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'JobBuddi API is running',
    version: '2.1.0-phase6.1',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      auth: '/api/auth',
      profile: '/api/profile',
      jobs: '/api/jobs', 
      automation: '/api/automation',
      analytics: '/api/analytics',
      naturalLanguage: '/api/nl'
    }
  });
});

// API documentation endpoint
app.get('/api/docs', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    documentation: {
      title: 'JobBuddi API v2.1 - Phase 6.1',
      description: 'Enhanced API with Natural Language Job Search capabilities',
      endpoints: {
        '/api/auth': {
          description: 'Authentication and authorization',
          methods: ['POST /login', 'POST /register', 'POST /refresh', 'POST /logout']
        },
        '/api/profile': {
          description: 'User profile, CV, and certificates management',
          methods: ['GET /', 'PUT /', 'POST /cv/upload', 'POST /certificates']
        },
        '/api/jobs': {
          description: 'Job search, matching, and applications',
          methods: ['GET /', 'POST /search', 'POST /:id/apply', 'GET /applications', 'PUT /preferences']
        },
        '/api/automation': {
          description: 'Email processing and interview automation',
          methods: ['GET /communications', 'POST /email/classify', 'POST /interview/schedule', 'POST /response/generate']
        },
        '/api/analytics': {
          description: 'Dashboard analytics and insights',
          methods: ['GET /dashboard', 'GET /applications', 'GET /skills', 'GET /performance']
        },
        '/api/nl': {
          description: 'Phase 6.1: Natural Language Job Search',
          methods: ['POST /search/natural', 'POST /search/parse', 'GET /search/suggestions'],
          examples: [
            'POST /api/nl/search/natural - "Find remote React jobs in London"',
            'POST /api/nl/search/parse - Parse query without searching',
            'GET /api/nl/search/suggestions - Get search examples'
          ]
        }
      }
    }
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/build')));
  
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
  });
}

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    suggestion: 'Check /api/docs for available endpoints'
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  
  res.status(statusCode).json({
    status,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err.details 
    }),
  });
});

export default app;