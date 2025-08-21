# 🌐 Deployment Guide

This guide shows simple ways to run Cozy Critter on popular hosting services. It uses plain language for neurodivergent folks and anyone new to deployment.

The core app is static.

## Before you start
1. Fork this repository to your own GitHub account.
2. Copy `.env.example` to `.env`, adjust any values, and provide it to your hosting service (never commit secrets).
3. Push your fork to GitHub so the platforms can access it.

## Netlify (client only)
Netlify is good for serving the built React client.

1. Sign up at [netlify.com](https://netlify.com) and click **Add new site → Import an existing project**.
2. Pick your GitHub fork.
3. Set **Build command** to `npm run build`.
4. Set **Publish directory** to `client/dist`.
5. Add any needed environment variables under **Site settings → Environment variables**.
6. Press **Deploy site**.

## Docker Deployment

For Docker-based deployments, especially when using `docker-compose.yml` for multi-container setups:

### Pre-deployment Cleanup (Recommended)
To prevent port conflicts and improve reliability, clean up old containers and networks before deploying:

```bash
# Stop and remove existing containers (if any)
docker compose down

# Remove stopped containers
docker container prune -f

# Remove unused networks  
docker network prune -f

# Remove unused images (optional)
docker image prune -f
```

### Basic Docker Commands
```bash
# Build and start containers
docker compose up -d

# View logs
docker compose logs

# Stop containers
docker compose down

# Update and restart
docker compose down && docker compose pull && docker compose up -d
```

**Important:** Always use the modern `docker compose` command (not the legacy `docker-compose`) for better compatibility and features.

Need help? Open an issue and we’ll gladly guide you.
