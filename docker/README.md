# 🐳 CozyCritters Docker Deployment

Quick reference for Docker deployment of CozyCritters.

## Quick Start

```bash
# Clone and build
git clone https://github.com/CatgirlRika/CozyCritters.git
cd CozyCritters
./docker-build.sh

# Deploy
docker compose up -d

# Access at http://localhost:3000
```

## Files Overview

| File | Purpose |
|------|---------|
| `docker-build.sh` | Build script - run this first |
| `docker-compose.yml` | Main deployment configuration |
| `Dockerfile.simple` | Container definition (nginx + static files) |
| `.env.docker` | Environment variables template |
| `docker/` | Nginx configuration files |

## Common Commands

```bash
# Build application
./docker-build.sh

# Start services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Rebuild after changes
docker compose down
./docker-build.sh
docker compose up -d
```

## Customization

- **Port**: Set `PORT=8080` in `.env` file
- **Nginx config**: Edit `docker/default.conf.template`
- **HTTPS**: Uncomment Caddy section in `docker-compose.yml`

## Health Check

```bash
curl http://localhost:3000/health
# Should return: healthy
```

## Full Documentation

📖 See [docs/docker.md](../docs/docker.md) for complete setup guide.