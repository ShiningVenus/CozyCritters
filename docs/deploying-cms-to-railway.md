# Deploying the Cozy Critters CMS Backend to Railway (No Frontend, ND Friendly Guide)

This step-by-step guide will help you deploy the Cozy Critters CMS (backend only) to [Railway](https://railway.app/).  
It uses plain language, respects neurodivergent needs, and avoids unnecessary pressure or jargon.

---

## What You'll Need

- A [GitHub](https://github.com/) account with access to your Cozy Critters repository
- A [Railway](https://railway.app/) account (sign up is free)
- The CMS code in the `/cms` folder of your repository

---

## Step 1: Prepare Your Code

1. Ensure your CMS code is in the `cms` directory.
2. Check that your `.gitignore` includes `cms/uploads/` so uploaded files are not tracked.
3. Make sure your `cms/package.json` has these scripts:
   ```json
   "scripts": {
     "dev": "tsx watch src/index.ts",
     "build": "tsc",
     "start": "node dist/index.js"
   }
   ```
4. There should be NO frontend (no React, no static file serving) in this deployment.

---

## Step 2: Push Your Code to GitHub

If you haven’t already, push your latest changes to your GitHub repository.

---

## Step 3: Create a New Project on Railway

1. Go to [https://railway.app/](https://railway.app/) and sign in.
2. Click **New Project**, then **Deploy from GitHub repo**.
3. Choose your Cozy Critters repository.
4. When asked for the root directory, enter `cms` (this tells Railway to build and run just the backend).

---

## Step 4: Configure Build and Start Commands

In your Railway project settings:

- **Build command:**  
  ```
  npm install && npm run build
  ```
- **Start command:**  
  ```
  npm start
  ```
- **Root directory:**  
  ```
  cms
  ```

These tell Railway to only use the backend code.

---

## Step 5: Set Environment Variables (If Needed)

- If your CMS code uses any environment variables (like `PORT`), you can set them in the Railway dashboard under **Variables**.
- By default, the server runs on port `4000` if not set.

---

## Step 6: Deploy

- Click **Deploy**.
- Wait for Railway to install dependencies, build, and start your CMS server.
- If you see “project deployed” or a green status, it’s ready.

---

## Step 7: Test Your Deployment

1. Find the public URL Railway gives you (e.g., `https://cozy-critters-cms.up.railway.app`)
2. Try visiting `/moods`, `/games`, or `/pages` in your browser or with a tool like [Postman](https://www.postman.com/).
3. You should see JSON data.

---

## Step 8: Uploads (If Needed)

- The `/upload` endpoint accepts images, PDFs, or plain text files.
- Use a tool like Postman or curl to test uploads:
  ```sh
  curl -F "file=@myfile.png" https://YOUR_CMS_URL/upload
  ```
- Uploaded files are stored in the server’s `/uploads` folder, but may be lost if Railway redeploys or restarts. (For persistent storage, consider a cloud bucket.)

---

## Self-Care Reminders

- Take breaks as needed. There’s no rush.
- If something doesn’t work, it’s not your fault. Mistakes are part of learning.
- If you need help, Railway has [support docs](https://docs.railway.app/) and you can always take your time.

---

## Common Troubleshooting

- **“Could not find the build directory: /app/dist/public”**  
  This should NOT appear if you are deploying only the CMS, with no static file serving code.

- **Uploads not working?**  
  Make sure you use the `/upload` endpoint and send files as `multipart/form-data`.

- **Data not saving?**  
  The CMS uses simple file storage (e.g., `cms/storage/`). Data will be lost if the server restarts.

---

## Accessibility and ND-Friendliness

- No timers, no deadlines.
- Steps are broken down clearly and can be done at your own pace.
- All language is meant to be supportive and affirming.

---

You did it! Your Cozy Critters CMS backend is now running on Railway.  
If you ever need to make changes, push them to GitHub and Railway will redeploy automatically.
