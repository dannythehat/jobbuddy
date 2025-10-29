# Multi-stage Production Dockerfile for JobBuddy Frontend
# Optimized for Google Cloud Run deployment with Nginx

# Stage 1: Dependencies
FROM node:18-alpine AS dependencies

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install && npm cache clean --force

# Stage 2: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependencies
COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./

# Copy source code
COPY public/ ./public/
COPY src/ ./src/
COPY tsconfig.json ./

# Build arguments for environment variables
ARG REACT_APP_API_URL
ARG REACT_APP_ENV=production

# Set environment variables for build
ENV REACT_APP_API_URL=$REACT_APP_API_URL \
    REACT_APP_ENV=$REACT_APP_ENV \
    NODE_ENV=production

# Build the React application
RUN npm run build

# Stage 3: Production with Nginx
FROM nginx:1.25-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Create nginx user and set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

# Expose port 8080 (required for Cloud Run)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
