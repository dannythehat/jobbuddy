# API Reference

## Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-domain.com/api`

## Authentication
All API endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh JWT token

### User Profile
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile
- `POST /user/cv` - Upload CV file
- `GET /user/cv` - Get parsed CV data

### Job Management
- `GET /jobs` - List available jobs
- `GET /jobs/:id` - Get specific job details
- `POST /jobs/search` - Search jobs with filters
- `POST /jobs/match` - Get AI-powered job matches

### Applications
- `GET /applications` - List user applications
- `POST /applications` - Create new application
- `GET /applications/:id` - Get application details
- `PUT /applications/:id` - Update application
- `DELETE /applications/:id` - Delete application

### Analytics
- `GET /analytics/dashboard` - Get dashboard data
- `GET /analytics/performance` - Get performance metrics
- `GET /analytics/trends` - Get application trends

### Interview Management
- `GET /interviews` - List scheduled interviews
- `POST /interviews` - Schedule new interview
- `PUT /interviews/:id` - Update interview details
- `DELETE /interviews/:id` - Cancel interview

## Response Format
All API responses follow this format:
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "timestamp": "2025-10-24T05:54:00Z"
}
```

## Error Handling
Error responses include:
```json
{
  "success": false,
  "error": {
    "code": 400,
    "message": "Error description",
    "details": {}
  },
  "timestamp": "2025-10-24T05:54:00Z"
}
```

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per authenticated user

For detailed endpoint specifications and examples, see the backend source code in `/backend/src/routes/`.