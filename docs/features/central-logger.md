# Feature: Central Logger

## Overview
Unified logging system for consistent debugging and monitoring across all services.

## Time Estimate: 1 hour

## Implementation Steps

### Step 1: Create Logger Utility (20 min)
**File**: `backend/src/utils/logger.ts`

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;
```

### Step 2: Install Dependencies (5 min)
```bash
cd backend
npm install winston
```

### Step 3: Update Services (30 min)
Replace `console.log/error` with logger in:
- `jobBoardSyncService.ts`
- `LinkedInClient.ts`
- `jobBoardRoutes.ts`

Example:
```typescript
// Before
console.error('LinkedIn job fetch error:', error);

// After
import logger from '../utils/logger';
logger.error('LinkedIn job fetch error', { error, context: 'fetchJobs' });
```

### Step 4: Create Logs Directory (5 min)
```bash
mkdir -p backend/logs
echo "logs/" >> backend/.gitignore
```

## Testing
```bash
# Start backend
cd backend && npm run dev

# Trigger some actions
# Check logs/combined.log and logs/error.log
```

## Benefits
- ✅ Structured logging
- ✅ Log levels (info, warn, error)
- ✅ File rotation ready
- ✅ Easy to add external services (Datadog, etc.)

## Files to Create
- `backend/src/utils/logger.ts`

## Files to Modify
- `backend/src/services/jobBoardSyncService.ts`
- `backend/src/services/jobBoard/LinkedInClient.ts`
- `backend/src/routes/jobBoardRoutes.ts`
- `backend/.gitignore`

Ready to implement?
