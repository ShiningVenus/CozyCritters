## Installing Docker (Beginner Friendly Guide)

If you are new to Docker, follow these steps to install Docker and Docker Compose on your computer.

### Windows

1. **Download Docker Desktop**
   - Visit the official Docker website: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
   - Click "Download for Windows" and save the installer.

2. **Run the Installer**
   - Double-click the downloaded file to begin installation.
   - Follow the on-screen instructions. You may be asked to enable WSL 2 (Windows Subsystem for Linux); if so, follow the prompts.

3. **Start Docker Desktop**
   - After installation, launch Docker Desktop from the Start menu.
   - Wait for the Docker whale icon to appear in your system tray — this means Docker is running.

4. **Verify Installation**
   - Open "Command Prompt" or "PowerShell".
   - Type: `docker --version`
   - You should see the installed Docker version.

### Mac

1. **Download Docker Desktop**
   - Visit [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
   - Click "Download for Mac" (choose Intel or Apple Silicon based on your Mac).

2. **Install Docker Desktop**
   - Open the downloaded file and drag the Docker icon to your Applications folder.
   - Open Docker Desktop from Applications.

3. **Verify Installation**
   - Open "Terminal" and type: `docker --version`
   - You should see the installed Docker version.

### Linux (Ubuntu example)

1. **Open Terminal**

2. **Install Docker Engine**
   - Run these commands one by one:
     ```bash
     sudo apt-get update
     sudo apt-get install ca-certificates curl gnupg
     sudo install -m 0755 -d /etc/apt/keyrings
     curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
     echo \
       "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
       $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
     sudo apt-get update
     sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
     ```

3. **Verify Installation**
   - Type: `docker --version`
   - You should see the installed Docker version.

4. **(Optional) Allow running Docker without `sudo`:**
   ```bash
   sudo usermod -aG docker $USER
   # Log out and log back in for this change to take effect.
   ```

### Need Help?

- See Docker’s official installation guides: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)
- If you get stuck, ask for help on GitHub Issues or search for your error message.

---

# Docker Deployment Guide for CozyCritters

This guide explains how to deploy CozyCritters using Docker for easy self-hosting.

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for building the application)

### Option 1: Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/CatgirlRika/CozyCritters.git
   cd CozyCritters
   ```

2. **Build the application**
   ```bash
   ./docker-build.sh
   ```

3. **Configure environment (optional)**
   ```bash
   cp .env.docker .env
   # Edit .env to customize port and other settings
   ```

4. **Start the application**
   ```bash
   docker compose up -d
   ```

5. **Access the application**
   - Open your browser to http://localhost:3000
   - Change the port in `.env` file if needed

### Option 2: Using Docker directly

1. **Build the application first**
   ```bash
   ./docker-build.sh
   ```

2. **Build the Docker image**
   ```bash
   docker build -f Dockerfile.simple -t cozy-critters .
   ```

3. **Run the container**
   ```bash
   docker run -d -p 3000:80 --name cozy-critters cozy-critters
   ```

## Why Two-Step Build Process?

CozyCritters uses a two-step build process for reliability:

1. **Local build**: Uses your local Node.js environment to build the React application
2. **Docker packaging**: Packages the built static files into an optimized nginx container

This approach:
- ✅ Avoids Node.js dependency issues in Docker
- ✅ Reduces Docker image size (only contains nginx + static files)
- ✅ Faster deployment (no compilation time in container)
- ✅ More reliable across different environments

## Configuration Options

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Host port to expose the application | `3000` |

**Note**: Since CozyCritters is a static PWA, most configuration happens at build time. Environment variables for features like Chatwoot integration should be set before running `./docker-build.sh`.

### Custom Configuration

#### Custom Nginx Configuration
If you need to customize the nginx configuration:

1. Copy the default configuration:
   ```bash
   cp docker/default.conf.template docker/custom-nginx.conf
   ```

2. Modify `docker/custom-nginx.conf` as needed

3. Uncomment the volume mount in `docker-compose.yml`:
   ```yaml
   volumes:
     - ./docker/custom-nginx.conf:/etc/nginx/conf.d/default.conf:ro
   ```

## HTTPS Support (Required for Full PWA Features)

For full PWA functionality (app installation, offline mode), HTTPS is required. We provide a Caddy reverse proxy setup for easy HTTPS:

1. **Configure your domain in `.env`**
   ```bash
   DOMAIN=your-domain.com
   ```

2. **Enable the reverse proxy in docker-compose.yml**
   ```bash
   # Uncomment the reverse-proxy service and volumes sections
   ```

3. **Update Caddyfile**
   ```bash
   # Edit docker/Caddyfile and replace 'your-domain.com' with your actual domain
   ```

4. **Start with HTTPS**
   ```bash
   docker-compose up -d
   ```

Caddy will automatically obtain and renew SSL certificates from Let's Encrypt.

## Data Persistence

CozyCritters stores all user data in the browser's localStorage, so no external database or volumes are required. User data persists as long as they use the same browser on the same device.

## Updating

To update to the latest version:

```bash
# Pull latest changes
git pull origin main

# Rebuild application
./docker-build.sh

# Restart containers
docker compose down
docker compose up -d
```

## Monitoring

### Health Checks

The container includes a health check endpoint:
```bash
curl http://localhost:3000/health
```

### Logs

View application logs:
```bash
# Docker Compose
docker-compose logs -f cozy-critters

# Docker directly
docker logs -f cozy-critters
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the `PORT` in your `.env` file
   - Or stop the conflicting service

2. **PWA features not working**
   - Ensure you're using HTTPS (required for PWA)
   - Check browser developer tools for service worker errors

3. **Build fails**
   - Ensure you have sufficient disk space
   - Check that all required files are present

### Performance Tuning

For production deployments, consider:

1. **Resource limits**
   ```yaml
   deploy:
     resources:
       limits:
         memory: 512M
       reservations:
         memory: 256M
   ```

2. **Restart policies**
   ```yaml
   restart: unless-stopped
   ```

3. **Container security**
   ```yaml
   security_opt:
     - no-new-privileges:true
   read_only: true
   tmpfs:
     - /tmp
     - /var/cache/nginx
     - /var/run
   ```

## Support

For issues specific to Docker deployment, please check:
1. [Docker documentation](docs/docker.md)
2. [General self-hosting guide](docs/self-hosting.md)
3. [GitHub Issues](https://github.com/CatgirlRika/CozyCritters/issues)
