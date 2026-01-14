# Vercel Deployment Guide

This guide will help you deploy the frontend to Vercel and connect it to your Render backend.

## Prerequisites

1. ✅ Backend deployed on Render (get your backend URL, e.g., `https://your-backend.onrender.com`)
2. ✅ GitHub repository with your code
3. ✅ Vercel account (sign up at https://vercel.com)

## Step 1: Deploy to Vercel

1. Go to https://vercel.com and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Create React App (auto-detected)
   - **Root Directory**: `frontend` ⚠️ **IMPORTANT!**
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `build` (default)
   - **Install Command**: `npm install` (default)

## Step 2: Set Environment Variables ⚠️ CRITICAL

**This is the most important step!** Without this, your frontend won't be able to connect to the backend.

1. In the Vercel project settings, go to **"Settings"** → **"Environment Variables"**
2. Add the following environment variable:

   **Variable Name:** `REACT_APP_API_URL`
   
   **Value:** Your Render backend URL (e.g., `https://your-backend.onrender.com`)
   
   **Important Notes:**
   - ⚠️ **Do NOT include a trailing slash** (e.g., use `https://your-backend.onrender.com` not `https://your-backend.onrender.com/`)
   - ⚠️ **Do NOT include `/api`** - the frontend code adds that automatically
   - ✅ Use the full URL including `https://`
   - ✅ Apply to: **Production**, **Preview**, and **Development** (or at least Production)

3. Click **"Save"**

## Step 3: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 2-3 minutes)
3. Once deployed, you'll get a URL like `https://your-app.vercel.app`

## Step 4: Verify Deployment

1. Open your Vercel deployment URL in a browser
2. Open the browser's Developer Console (F12)
3. Look for the API configuration log:
   ```
   🔧 API Configuration: {
     baseUrl: "https://your-backend.onrender.com",
     environment: "production",
     hasApiUrl: true
   }
   ```
4. Try signing in with Google
5. Check the Network tab to see if API requests are being made to your backend

## Step 5: Update Backend CORS (If Needed)

If you get CORS errors, make sure your backend allows your Vercel domain:

1. Go to your Render backend dashboard
2. Add environment variable:
   - **Key:** `FRONTEND_URL`
   - **Value:** Your Vercel URL (e.g., `https://your-app.vercel.app`)

**Note:** The backend CORS is already configured to allow all Vercel domains (`.vercel.app`), so this step is usually not needed unless you're using a custom domain.

## Troubleshooting

### Error: "Cannot connect to backend server"

**Possible causes:**
1. ❌ `REACT_APP_API_URL` not set in Vercel
   - **Solution:** Go to Vercel Settings → Environment Variables and add it

2. ❌ Wrong backend URL format
   - **Wrong:** `https://your-backend.onrender.com/` (trailing slash)
   - **Wrong:** `https://your-backend.onrender.com/api` (includes /api)
   - **Correct:** `https://your-backend.onrender.com`

3. ❌ Backend not deployed or not running
   - **Solution:** Check Render dashboard to ensure backend is running
   - Test backend directly: `curl https://your-backend.onrender.com/api/health`

4. ❌ CORS error in browser console
   - **Solution:** Add `FRONTEND_URL` environment variable to Render backend
   - Or check that your Vercel domain matches the CORS allowed origins

### Error: "NetworkError" or "Failed to fetch"

This usually means:
- Backend URL is incorrect
- Backend is not accessible
- CORS is blocking the request

**Solution:**
1. Check browser console for the exact error
2. Verify `REACT_APP_API_URL` is set correctly in Vercel
3. Test backend health endpoint manually
4. Check Render logs for backend errors

### Environment Variable Not Working

**Important:** After adding/changing environment variables in Vercel:
1. You must **redeploy** for changes to take effect
2. Go to **"Deployments"** → Click **"..."** → **"Redeploy"**
3. Or push a new commit to trigger a new deployment

### Check Environment Variables in Build

To verify environment variables are being used:
1. Check the build logs in Vercel
2. Look for the API configuration log in browser console
3. The log should show your backend URL, not "Using proxy"

## Quick Checklist

Before deploying, make sure:
- [ ] Backend is deployed and running on Render
- [ ] You have your backend URL (e.g., `https://your-backend.onrender.com`)
- [ ] Root directory is set to `frontend` in Vercel
- [ ] `REACT_APP_API_URL` environment variable is set in Vercel
- [ ] Environment variable value is correct (no trailing slash, no /api)
- [ ] Applied to Production (and Preview if needed)
- [ ] Redeployed after setting environment variables

## Testing Locally with Production Backend

To test your frontend locally but connect to your production backend:

1. Create a `.env` file in the `frontend` folder:
   ```
   REACT_APP_API_URL=https://your-backend.onrender.com
   ```

2. Restart your development server:
   ```bash
   npm start
   ```

3. The frontend will now connect to your production backend instead of localhost

## Support

If you're still having issues:
1. Check Vercel build logs for errors
2. Check browser console for API errors
3. Check Render backend logs
4. Verify environment variables are set correctly
5. Test backend health endpoint: `https://your-backend.onrender.com/api/health`
