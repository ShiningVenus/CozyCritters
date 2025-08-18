# Multi-stage build for CozyCritters PWA
# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm config set strict-ssl false && npx vite build && node scripts/copy-content.js

# Stage 2: Serve with nginx
FROM nginx:alpine AS runtime

# Copy custom nginx configuration  
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/default.conf.template /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
COPY --from=builder /app/client/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Use default nginx entrypoint
CMD ["nginx", "-g", "daemon off;"]