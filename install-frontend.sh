#!/usr/bin/env bash
set -e

# Production installation script for Cozy Critter
# This script builds the application and provides options for running it

# For Docker deployments, consider running cleanup commands before deployment:
# docker compose down              # Stop existing containers
# docker container prune -f       # Remove stopped containers  
# docker network prune -f         # Remove unused networks
# docker image prune -f           # Remove unused images
# Use modern 'docker compose' syntax instead of legacy 'docker-compose'

# Ensure we're at repo root
cd "$(dirname "$0")"

# Check Node.js version
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required. Please install Node.js >=18" >&2
  exit 1
fi

NODE_MAJOR=$(node -v | sed -E 's/^v([0-9]+).*/\1/')
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "Node.js >=18 is required. Current version: $(node -v)" >&2
  exit 1
fi

echo "Installing dependencies..."
npm ci

echo "Building project..."
npm run build

echo "✓ Build complete! Static files are in client/dist/"
echo "  You can serve this directory with any static file server"
echo "  For Docker deployments, copy client/dist/ contents to your web server"

case "$1" in
  start)
    echo "Starting application..."
    npm_config_production=false npm start
    ;;
  pm2)
    if ! command -v pm2 >/dev/null 2>&1; then
      echo "PM2 is not installed. Install with 'npm install -g pm2'" >&2
      exit 1
    fi
    pm2 start dist/index.js --name cozy-critter
    pm2 save
    echo "PM2 service 'cozy-critter' started. Use 'pm2 startup' to run on boot."
    ;;
  systemd)
    cat <<'UNIT'
[Unit]
Description=Cozy Critter Service
After=network.target

[Service]
Type=simple
WorkingDirectory=$(pwd)
ExecStartPre=$(command -v npm) ci --omit=dev
ExecStart=$(command -v npm) start
Restart=on-failure
Environment=NODE_ENV=production npm_config_production=false

[Install]
WantedBy=multi-user.target
UNIT
    echo "Save the above service definition to /etc/systemd/system/cozy-critter.service and run:"
    echo "  sudo systemctl daemon-reload"
    echo "  sudo systemctl enable --now cozy-critter"
    ;;
  *)
    echo "Run './install-frontend.sh start' to launch or './install-frontend.sh pm2' for a PM2 service." \
    "Use './install-frontend.sh systemd' to print a systemd unit file."
    ;;
esac
