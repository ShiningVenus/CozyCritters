# 🌐 Deployment Guide

This guide shows simple ways to run Cozy Critter on popular hosting services. It uses plain language for neurodivergent folks and anyone new to deployment.

The core app is static.

## Before you start
1. Fork this repository to your own GitHub account.
2. Create an `.env` file if the project requires keys or URLs and push it to your hosting service (never commit secrets).
3. Push your fork to GitHub so the platforms can access it.

## Netlify (client only)
Netlify is good for serving the built React client.

1. Sign up at [netlify.com](https://netlify.com) and click **Add new site → Import an existing project**.
2. Pick your GitHub fork.
3. Set **Build command** to `npm run build`.
4. Set **Publish directory** to `client/dist`.
5. Add any needed environment variables under **Site settings → Environment variables**.
6. Press **Deploy site**.

Need help? Open an issue and we’ll gladly guide you.
