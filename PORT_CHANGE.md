# Port Changed from 5000 to 5001

## Why?
Port 5000 is used by macOS AirPlay/AirTunes service, which conflicts with the backend server.

## What Changed?
- Backend now runs on port **5001** instead of 5000
- Frontend proxy updated to point to port 5001

## Next Steps

1. **Stop the backend server** if it's running (Ctrl+C)

2. **Restart the backend:**
   ```bash
   cd backend
   npm run dev
   ```
   
   You should now see:
   ```
   ✅ Server is running on port 5001
   ```

3. **Test the new endpoint:**
   ```bash
   curl http://localhost:5001/api/health
   ```
   
   Or in browser: http://localhost:5001/api/health

4. **Restart the frontend** (if it's running):
   ```bash
   cd frontend
   npm start
   ```

## New URLs

- Backend API: http://localhost:5001/api
- Health Check: http://localhost:5001/api/health
- Frontend: http://localhost:3000 (unchanged)







