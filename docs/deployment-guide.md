# 🌐 Deployment Guide

This guide shows simple ways to run Cozy Critter on popular hosting services. It uses plain language for neurodivergent folks and anyone new to deployment.

CozyCritters is a static Progressive Web App (PWA) that works great on many hosting platforms.

## 🚀 Quick Start Options

Choose the deployment method that fits your needs:

**🆓 Free & Easy (Static Hosting):**
- [Netlify](#netlify-static-hosting) - Automatic builds from GitHub
- [Vercel](#vercel-static-hosting) - Fast deployment with built-in CDN
- [GitHub Pages](#github-pages) - Free hosting for open source projects

**🌐 VPS & Cloud (Full Control):**
- [**📖 Complete VPS Guide**](vps-deployment.md) - DigitalOcean, Linode, AWS, shared hosting

**🐳 Self-Hosting (Advanced):**
- [Docker Deployment](#docker-deployment) - Containerized deployment
- [**📖 Complete Self-Hosting Guide**](self-hosting.md) - Full self-hosting options

## Before you start
1. Fork this repository to your own GitHub account.
2. Copy `.env.example` to `.env`, adjust any values, and provide it to your hosting service (never commit secrets).
3. Push your fork to GitHub so the platforms can access it.

## Netlify (Static Hosting)
Perfect for quick deployments with automatic builds.

1. Sign up at [netlify.com](https://netlify.com) and click **Add new site → Import an existing project**.
2. Pick your GitHub fork.
3. Set **Build command** to `npm run build`.
4. Set **Publish directory** to `client/dist`.
5. Add any needed environment variables under **Site settings → Environment variables**.
6. Press **Deploy site**.

**✅ Benefits:** Automatic HTTPS, automatic deployments from GitHub, free tier
**❌ Limitations:** Static hosting only, limited build minutes on free tier

## Vercel (Static Hosting)
Fast deployment with excellent performance.

1. Sign up at [vercel.com](https://vercel.com) and connect your GitHub account.
2. Click **New Project** and select your CozyCritters fork.
3. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `client/dist`
4. Add environment variables if needed.
5. Click **Deploy**.

**✅ Benefits:** Excellent performance, automatic HTTPS, generous free tier
**❌ Limitations:** Static hosting only

## GitHub Pages
Free hosting directly from your GitHub repository.

1. Go to your fork's **Settings** → **Pages**.
2. Set **Source** to **GitHub Actions**.
3. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./client/dist
```

**✅ Benefits:** Completely free, integrates with GitHub
**❌ Limitations:** Public repositories only (for free), custom domains require upgrade

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
📖 **For complete Docker setup including HTTPS:** See the [Docker Deployment Guide](docker.md)

## 🌐 VPS & Cloud Hosting

For production deployments with full control:

📖 **[Complete VPS Deployment Guide](vps-deployment.md)**

Covers:
- **DigitalOcean** (App Platform, Droplets)
- **Other VPS providers** (Linode, Vultr, AWS EC2, Hetzner)
- **Shared hosting** (cPanel, traditional web hosts)
- **Domain setup and SSL configuration**
- **Performance optimization**
- **Troubleshooting**

## Need Help?

- 📖 **[VPS Deployment Guide](vps-deployment.md)** - Comprehensive VPS and cloud hosting
- 📖 **[Docker Guide](docker.md)** - Detailed Docker deployment
- 📖 **[Self-Hosting Guide](self-hosting.md)** - Advanced self-hosting options
- 🐛 **[GitHub Issues](https://github.com/ShiningVenus/CozyCritters/issues)** - Technical support
- 💬 **[Community Forum](../FORUMS.md)** - Community help

Remember: CozyCritters is designed to be accessible for everyone. Don't hesitate to ask for help! 🎉

