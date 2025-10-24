import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';

// Rate limiting configurations
export const createRateLimit = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// General API rate limit
export const generalRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  'Too many requests from this IP, please try again later.'
);

// Auth rate limit (stricter)
export const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // limit each IP to 5 requests per windowMs
  'Too many authentication attempts, please try again later.'
);

// File upload rate limit
export const uploadRateLimit = createRateLimit(
  60 * 60 * 1000, // 1 hour
  10, // limit each IP to 10 uploads per hour
  'Too many file uploads, please try again later.'
);

// Security headers configuration
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.openai.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// CORS configuration
export const corsConfig = cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://jobbuddi.com']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

// Input validation middleware
export const validateInput = (req: Request, res: Response, next: NextFunction) => {
  // Remove any potential XSS attempts
  const sanitizeString = (str: string): string => {
    return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  };

  // Recursively sanitize object
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return sanitizeString(obj);
    }
    if (typeof obj === 'object' && obj !== null) {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};

// API key validation middleware
export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  // In production, validate against stored API keys
  const validApiKeys = process.env.VALID_API_KEYS?.split(',') || [];
  
  if (process.env.NODE_ENV === 'production' && !validApiKeys.includes(apiKey as string)) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  next();
};

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString(),
    };
    
    // Log to console in development, to proper logging service in production
    if (process.env.NODE_ENV === 'development') {
      console.log(JSON.stringify(logData, null, 2));
    } else {
      // TODO: Integrate with logging service (e.g., Winston, DataDog)
      console.log(JSON.stringify(logData));
    }
  });

  next();
};

// Error handling middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const errorResponse = {
    error: isDevelopment ? err.message : 'Internal server error',
    ...(isDevelopment && { stack: err.stack }),
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  };

  res.status(err.status || 500).json(errorResponse);
};

export default {
  generalRateLimit,
  authRateLimit,
  uploadRateLimit,
  helmetConfig,
  corsConfig,
  validateInput,
  validateApiKey,
  requestLogger,
  errorHandler,
};