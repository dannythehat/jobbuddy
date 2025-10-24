# Deployment Guide

## 🚀 Production Deployment Options

### Option 1: Docker Compose (Recommended)

The easiest way to deploy JobBuddy in production:

```bash
# Clone repository
git clone https://github.com/dannythehat/jobbuddy.git
cd jobbuddy

# Configure production environment
cp backend/.env.production.example backend/.env.production
# Edit backend/.env.production with your production values

# Deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

**Services included:**
- JobBuddy Backend (Node.js/Express)
- JobBuddy Frontend (React)
- PostgreSQL Database
- Redis Cache
- Nginx Reverse Proxy

### Option 2: Manual Deployment

For custom server setups:

```bash
# 1. Install dependencies
npm install --production

# 2. Build applications
cd frontend && npm run build
cd ../backend && npm run build

# 3. Set up database
createdb jobbuddy
node scripts/init-db.js

# 4. Start services
# Backend
cd backend && npm start

# Frontend (serve build files with nginx/apache)
# Point web server to frontend/build directory
```

### Option 3: Cloud Platforms

#### AWS Deployment
- **ECS**: Use provided Docker images
- **Elastic Beanstalk**: Deploy Node.js application
- **RDS**: PostgreSQL database
- **ElastiCache**: Redis cache

#### Google Cloud Platform
- **Cloud Run**: Container deployment
- **Cloud SQL**: PostgreSQL database
- **Memorystore**: Redis cache

#### Azure
- **Container Instances**: Docker deployment
- **Azure Database**: PostgreSQL
- **Azure Cache**: Redis

## 🔧 Configuration

### Environment Variables

**Backend (.env.production):**
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/jobbuddy
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=jobbuddy
DB_USER=your-db-user
DB_PASSWORD=your-db-password

# Redis
REDIS_URL=redis://your-redis-host:6379
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# JWT
JWT_SECRET=your-super-secure-jwt-secret
JWT_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Google Calendar (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback

# Server
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### SSL/TLS Configuration

For HTTPS (recommended):

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📊 Monitoring & Health Checks

### Health Check Endpoints
- Backend: `GET /health`
- Database: `GET /health/db`
- Redis: `GET /health/redis`

### Monitoring Setup

**Prometheus Configuration:**
```yaml
scrape_configs:
  - job_name: 'jobbuddy'
    static_configs:
      - targets: ['localhost:5000']
    metrics_path: '/metrics'
```

**Grafana Dashboard:**
- Import dashboard from `monitoring/grafana-dashboard.json`
- Monitor response times, error rates, database performance

## 🔒 Security Checklist

- [ ] Use HTTPS in production
- [ ] Set secure JWT secret
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Use environment variables for secrets
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Database connection encryption
- [ ] Redis authentication

## 🗄️ Database Management

### Backup Strategy
```bash
# Daily backup
pg_dump jobbuddy > backup_$(date +%Y%m%d).sql

# Automated backup script
0 2 * * * /usr/local/bin/backup-jobbuddy.sh
```

### Migration
```bash
# Run database migrations
node scripts/migrate.js

# Rollback if needed
node scripts/rollback.js
```

## 🚨 Troubleshooting

### Common Issues

**Database Connection:**
```bash
# Check PostgreSQL status
systemctl status postgresql

# Test connection
psql -h localhost -U username -d jobbuddy
```

**Redis Connection:**
```bash
# Check Redis status
systemctl status redis

# Test connection
redis-cli ping
```

**Application Logs:**
```bash
# Docker logs
docker-compose logs -f jobbuddy-backend

# PM2 logs (if using PM2)
pm2 logs jobbuddy
```

### Performance Optimization

**Database:**
- Enable connection pooling
- Add database indexes
- Regular VACUUM and ANALYZE

**Redis:**
- Configure memory limits
- Set appropriate eviction policies
- Monitor memory usage

**Application:**
- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies

## 📈 Scaling

### Horizontal Scaling
- Load balancer (nginx/HAProxy)
- Multiple application instances
- Database read replicas
- Redis clustering

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Tune Redis configuration
- Monitor resource usage

## 🔄 CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        run: |
          ssh user@server 'cd /app && git pull && docker-compose -f docker-compose.prod.yml up -d --build'
```

## 📞 Support

For deployment issues:
- Check logs first
- Review configuration
- Contact: dannythetruther@gmail.com