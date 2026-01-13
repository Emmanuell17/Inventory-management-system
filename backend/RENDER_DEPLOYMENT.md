# Render Deployment Guide

This guide will help you deploy the backend to Render and set up the PostgreSQL database.

## Prerequisites

1. A GitHub account with your code pushed to a repository
2. A Render account (sign up at https://render.com)

## Step 1: Create PostgreSQL Database on Render

1. Go to your Render dashboard: https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Configure the database:
   - **Name**: `inventory-db` (or any name you prefer)
   - **Database**: `inventory_db` (or leave default)
   - **User**: Leave default
   - **Region**: Choose closest to your users
   - **PostgreSQL Version**: Latest (14+)
   - **Plan**: Free tier is fine for development
4. Click **"Create Database"**
5. **Important**: Wait for the database to be fully provisioned (takes 1-2 minutes)
6. Once ready, copy the **Internal Database URL** (you'll need this)

## Step 2: Deploy Backend Service

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `inventory-backend` (or any name)
   - **Region**: Same as your database
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend` (important!)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free tier is fine for development

## Step 3: Set Environment Variables

In your Render Web Service settings, go to **"Environment"** and add:

### Required Variables:

```
DATABASE_URL=<paste the Internal Database URL from Step 1>
NODE_ENV=production
PORT=5000
```

### Optional Variables (if you have a frontend deployed):

```
FRONTEND_URL=https://your-frontend.vercel.app
RENDER_EXTERNAL_URL=https://your-backend.onrender.com
```

**Important Notes:**
- The `DATABASE_URL` is automatically provided by Render when you link the database
- You can also link the database in the Render dashboard (under "Connections") instead of manually setting `DATABASE_URL`
- The database schema will be automatically created when the server starts (no manual SQL needed!)

## Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Install dependencies
   - Start the server
   - Initialize the database schema (creates `grocery_items` table)

## Step 5: Verify Deployment

1. Wait for deployment to complete (usually 2-3 minutes)
2. Check the logs in Render dashboard - you should see:
   ```
   ✅ Connected to PostgreSQL database
   ✅ Database connection successful
   🔄 Initializing database schema...
   ✅ Database schema initialized successfully
   ✅ grocery_items table verified
   ✅ Server is running on port 5000
   ```

3. Test the health endpoint:
   ```bash
   curl https://your-backend.onrender.com/api/health
   ```
   Should return: `{"status":"ok","message":"Server is running"}`

## Troubleshooting

### Error: "relation grocery_items does not exist"

**Solution**: The database schema should auto-initialize. If you see this error:
1. Check the Render logs for initialization errors
2. The server will try to create the table on every startup
3. If it persists, you can manually run the schema:
   - Go to your PostgreSQL database in Render
   - Click "Connect" → "External Connection"
   - Use a PostgreSQL client (like pgAdmin or psql) to connect
   - Run the SQL from `backend/database/schema.sql`

### Error: "Database connection failed"

**Solutions**:
1. Verify `DATABASE_URL` is set correctly in environment variables
2. Make sure the database is fully provisioned (not still "Creating")
3. Check that you're using the **Internal Database URL** (not external)
4. Verify SSL is enabled (the code handles this automatically)

### Server keeps restarting

**Solutions**:
1. Check the logs for error messages
2. Verify all environment variables are set
3. Make sure `package.json` has the correct start script: `"start": "node server.js"`

## Database Schema Auto-Initialization

The backend automatically creates the `grocery_items` table on startup if it doesn't exist. This means:
- ✅ No manual SQL needed
- ✅ Works on first deployment
- ✅ Safe to restart (won't recreate existing tables)
- ✅ Uses `IF NOT EXISTS` to prevent errors

## Next Steps

After your backend is deployed:
1. Copy your backend URL (e.g., `https://your-backend.onrender.com`)
2. Update your frontend's `REACT_APP_API_URL` environment variable
3. Deploy your frontend to Vercel/Netlify
4. Test the full application!

## Support

If you encounter issues:
1. Check Render logs (most helpful)
2. Verify environment variables are set
3. Ensure database is fully provisioned
4. Check that root directory is set to `backend`
