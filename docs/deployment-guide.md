# 🌐 Deployment Guide

This guide shows simple ways to run Cozy Critter on popular hosting services. It uses plain language for neurodivergent folks and anyone new to deployment.

## Before you start
1. Fork this repository to your own GitHub account.
2. Create an `.env` file if the project requires keys or URLs and push it to your hosting service (never commit secrets).
3. Push your fork to GitHub so the platforms can access it.

## Netlify (client only)
Netlify is good for serving the built React client.

1. Sign up at [netlify.com](https://netlify.com) and click **Add new site → Import an existing project**.
2. Pick your GitHub fork.
3. Set **Build command** to `npm run build`.
4. Set **Publish directory** to `dist/public`.
5. Add any needed environment variables under **Site settings → Environment variables**.
6. Press **Deploy site**.

> Netlify hosts only the front‑end. If you need the API, deploy it separately (for example on Railway) and point the client to it.

## Vercel (full stack)
Vercel can run the server and serve the built client.

1. Sign in at [vercel.com](https://vercel.com) and click **New Project**.
2. Import your GitHub repository.
3. Configure the project:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
4. Add required environment variables in the **Environment Variables** section.
5. Deploy. Vercel will run `npm start` after building.

If the server does not start, add a `vercel.json` file with:

```json
{
  "builds": [{ "src": "dist/index.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "/dist/index.js" }]
}
```

Commit the file and redeploy.

## Railway (full stack)
Railway is a simple host for Node servers.

1. Create an account at [railway.app](https://railway.app) and choose **New Project → Deploy from GitHub repo**.
2. Select your repository.
3. When asked for commands enter:
   - **Build**: `npm run build`
   - **Start**: `npm start`
4. Add environment variables in the **Variables** tab.
5. Wait for the deployment to finish. Railway will give you a public URL.

---
Need help? Open an issue and we’ll gladly guide you.
