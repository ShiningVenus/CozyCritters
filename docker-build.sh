#!/bin/bash
set -e

echo "🐾 Building CozyCritters for Docker..."

# Check if Node.js is available
if ! command -v node >/dev/null 2>&1; then
    echo "❌ Node.js is required. Please install Node.js >=18"
    exit 1
fi

# Check Node.js version
NODE_MAJOR=$(node -v | sed -E 's/^v([0-9]+).*/\1/')
if [ "$NODE_MAJOR" -lt 18 ]; then
    echo "❌ Node.js >=18 is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm ci
fi

# Build the application
echo "🔨 Building application..."
npm run build

# Verify build output
if [ ! -d "client/dist" ]; then
    echo "❌ Build failed: client/dist directory not found"
    exit 1
fi

echo "✅ Build complete! Ready for Docker deployment."
echo ""
echo "To build and run with Docker:"
echo "  docker build -f Dockerfile.simple -t cozy-critters ."
echo "  docker run -p 3000:80 cozy-critters"
echo ""
echo "Or use docker compose:"
echo "  docker compose build"
echo "  docker compose up -d"