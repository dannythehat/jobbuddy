# Root Dockerfile - Redirects to backend
# This file exists for Cloud Build compatibility
# The actual build happens in backend/Dockerfile via cloudbuild.yaml

FROM node:18-alpine

WORKDIR /app

# This is a placeholder - actual build uses backend/Dockerfile
# See cloudbuild.yaml for the real build configuration

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/dist ./dist

EXPOSE 8080

CMD ["node", "dist/server.js"]
