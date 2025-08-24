# Self-hosting Cozy Critter

Cozy Critter is designed for simple self-hosting. It’s a static PWA; no backend required.

## Deployment Options

Choose the method that best fits your setup:

### 🐳 Docker (Recommended)

The easiest way to self-host with automatic HTTPS support.

```bash
git clone https://github.com/ShiningVenus/CozyCritters.git
cd CozyCritters
./docker-build.sh
docker compose up -d
```

📖 **[Full Docker Guide](docker.md)**

### 📦 Manual Installation

## Quick Start

1. **Clone the repo**  
   ```bash
   git clone https://github.com/CatgirlRika/CozyCritters.git
   cd CozyCritters
   ```

2. **Build the app**  
   If there’s a build step (for example, with Vite or React), run:
   ```bash
   npm install
   npm run build
   ```

3. **Serve the `dist` or `build` folder**  
   Use any static file server:
   ```bash
   npx serve client/dist
   ```
   Or deploy the contents of `client/dist/` to your web server (e.g., Nginx, Apache, Netlify, Vercel, GitHub Pages).

## Docker Self-Hosting

For containerized deployments, you can use Docker to host Cozy Critter.

### Pre-deployment Cleanup (Recommended)
Before starting new containers, clean up old ones to prevent conflicts:

```bash
# Stop any existing containers
docker compose down

# Clean up stopped containers, unused networks, and images
docker container prune -f
docker network prune -f
docker image prune -f
```

### Using Docker Compose
If you have a `docker-compose.yml` file:

```bash
# Start the application
docker compose up -d

# View logs
docker compose logs -f

# Stop the application  
docker compose down

# Update and restart
docker compose down && docker compose pull && docker compose up -d
```

### Manual Docker Commands
For simple single-container deployments:

```bash
# Build the image (if you have a Dockerfile)
docker build -t cozy-critter .

# Run the container
docker run -d -p 80:80 --name cozy-critter cozy-critter

# Stop and remove
docker stop cozy-critter && docker rm cozy-critter
```

**Note:** Always use modern `docker compose` syntax instead of legacy `docker-compose` for better compatibility.

## Configuration

- No configuration needed by default.
- All user data remains in the browser (localStorage).

## HTTPS Required

For full PWA features (like installability and offline use), your site must use HTTPS (except `localhost`).

## Updates

- Pull changes from this repo and re-deploy.
- No migration needed—user data is not affected.
- For backing up your mood entries, see [backup-export.md](./backup-export.md).

## Troubleshooting

- Clear browser cache if updates aren’t visible.
- Check console for errors; report issues on GitHub.