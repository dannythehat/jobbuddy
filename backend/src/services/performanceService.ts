import Redis from 'ioredis';
import { Request, Response, NextFunction } from 'express';

// Redis client for caching
let redisClient: Redis | null = null;

export const initializeRedis = () => {
  if (process.env.REDIS_URL) {
    redisClient = new Redis(process.env.REDIS_URL);
    console.log('Redis connected for caching');
  } else {
    console.log('Redis not configured, using memory cache fallback');
  }
};

// In-memory cache fallback
const memoryCache = new Map<string, { data: any; expiry: number }>();

// Cache service
export class CacheService {
  static async get(key: string): Promise<any> {
    try {
      if (redisClient) {
        const cached = await redisClient.get(key);
        return cached ? JSON.parse(cached) : null;
      } else {
        // Memory cache fallback
        const cached = memoryCache.get(key);
        if (cached && cached.expiry > Date.now()) {
          return cached.data;
        }
        memoryCache.delete(key);
        return null;
      }
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  static async set(key: string, data: any, ttlSeconds: number = 300): Promise<void> {
    try {
      if (redisClient) {
        await redisClient.setex(key, ttlSeconds, JSON.stringify(data));
      } else {
        // Memory cache fallback
        memoryCache.set(key, {
          data,
          expiry: Date.now() + (ttlSeconds * 1000)
        });
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  static async del(key: string): Promise<void> {
    try {
      if (redisClient) {
        await redisClient.del(key);
      } else {
        memoryCache.delete(key);
      }
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  static async flush(): Promise<void> {
    try {
      if (redisClient) {
        await redisClient.flushall();
      } else {
        memoryCache.clear();
      }
    } catch (error) {
      console.error('Cache flush error:', error);
    }
  }
}

// Cache middleware
export const cacheMiddleware = (ttlSeconds: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = `cache:${req.originalUrl}:${req.user?.id || 'anonymous'}`;
    
    try {
      const cached = await CacheService.get(cacheKey);
      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        return res.json(cached);
      }

      // Store original json method
      const originalJson = res.json;
      
      // Override json method to cache response
      res.json = function(data: any) {
        res.setHeader('X-Cache', 'MISS');
        CacheService.set(cacheKey, data, ttlSeconds);
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

// Performance monitoring
export class PerformanceMonitor {
  private static metrics = new Map<string, number[]>();

  static recordResponseTime(endpoint: string, duration: number): void {
    if (!this.metrics.has(endpoint)) {
      this.metrics.set(endpoint, []);
    }
    
    const times = this.metrics.get(endpoint)!;
    times.push(duration);
    
    // Keep only last 100 measurements
    if (times.length > 100) {
      times.shift();
    }
  }

  static getMetrics(): Record<string, any> {
    const result: Record<string, any> = {};
    
    for (const [endpoint, times] of this.metrics.entries()) {
      if (times.length > 0) {
        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        const min = Math.min(...times);
        const max = Math.max(...times);
        
        result[endpoint] = {
          average: Math.round(avg),
          min,
          max,
          count: times.length
        };
      }
    }
    
    return result;
  }
}

// Performance monitoring middleware
export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    PerformanceMonitor.recordResponseTime(req.route?.path || req.path, duration);
    
    // Log slow requests
    if (duration > 1000) {
      console.warn(`Slow request: ${req.method} ${req.path} took ${duration}ms`);
    }
  });

  next();
};

// Database query optimization
export const optimizeQuery = (query: any, options: any = {}) => {
  // Add common optimizations
  const optimized = {
    ...query,
    // Add indexes hint if available
    ...(options.useIndex && { useIndex: options.useIndex }),
    // Limit results if not specified
    ...(options.limit && { limit: options.limit }),
    // Add pagination
    ...(options.offset && { offset: options.offset }),
  };

  return optimized;
};

// Memory usage monitoring
export const getMemoryUsage = () => {
  const usage = process.memoryUsage();
  return {
    rss: Math.round(usage.rss / 1024 / 1024), // MB
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024), // MB
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024), // MB
    external: Math.round(usage.external / 1024 / 1024), // MB
  };
};

// Cleanup old cache entries periodically
setInterval(() => {
  if (!redisClient) {
    // Clean memory cache
    const now = Date.now();
    for (const [key, value] of memoryCache.entries()) {
      if (value.expiry <= now) {
        memoryCache.delete(key);
      }
    }
  }
}, 60000); // Every minute

export default {
  CacheService,
  cacheMiddleware,
  PerformanceMonitor,
  performanceMiddleware,
  optimizeQuery,
  getMemoryUsage,
  initializeRedis,
};