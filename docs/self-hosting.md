# Self-hosting Cozy Critter

Cozy Critter is designed for simple self-hosting. It’s a static PWA; no backend required.

## Deployment Options

Choose the method that best fits your setup:

### 🐳 Docker (Recommended)

The easiest way to self-host with automatic HTTPS support.

```bash
git clone https://github.com/CatgirlRika/CozyCritters.git
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
   npx serve dist
   ```
   Or deploy the contents of `dist/` to your web server (e.g., Nginx, Apache, Netlify, Vercel, GitHub Pages).

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