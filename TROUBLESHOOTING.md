# Troubleshooting: Blank White Screen

## Quick Checks

### 1. Check Browser Console
Open your browser's Developer Tools (F12 or Cmd+Option+I on Mac) and check the Console tab for any red error messages.

### 2. Verify Backend is Running
The frontend needs the backend to be running. Check if you see this in your backend terminal:
```
✅ Server is running on port 5000
```

If not, start it:
```bash
cd backend
npm run dev
```

### 3. Verify Frontend is Running
Check if you see this in your frontend terminal:
```
Compiled successfully!
You can now view inventory-frontend in the browser.
  Local:            http://localhost:3002
```

### 4. Check Network Tab
In browser DevTools → Network tab, look for failed requests to `/api/items`. If you see red errors, the backend isn't running or isn't accessible.

## Common Issues

### Issue: "Cannot connect to server"
**Solution**: Start the backend server first:
```bash
cd "/Users/odu_1/Inventory management system/backend"
npm run dev
```

### Issue: "Failed to fetch" or Network Error
**Solution**: 
1. Make sure backend is running on port 5000
2. Check if `.env` file exists in backend folder
3. Verify database connection (backend terminal will show errors)

### Issue: React app won't start
**Solution**: 
1. Make sure you're in the frontend directory
2. Run `npm install` if you haven't already
3. Try deleting `node_modules` and reinstalling:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Issue: Blank screen with no errors
**Solution**: 
1. Open browser console (F12)
2. Check for JavaScript errors
3. Try hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
4. Clear browser cache

## Step-by-Step Restart

1. **Stop both servers** (Ctrl+C in both terminals)

2. **Start Backend** (Terminal 1):
   ```bash
   cd "/Users/odu_1/Inventory management system/backend"
   npm run dev
   ```
   Wait until you see: "✅ Server is running on port 5000"

3. **Start Frontend** (Terminal 2):
   ```bash
   cd "/Users/odu_1/Inventory management system/frontend"
   npm start
   ```
   Wait until browser opens automatically

4. **Check the page** - You should see either:
   - The inventory list (if database has data)
   - "No items found" message (if database is empty)
   - An error message explaining what's wrong

## Still Not Working?

1. Check backend terminal for error messages
2. Check frontend terminal for compilation errors
3. Check browser console (F12) for JavaScript errors
4. Verify database is set up correctly (see README.md)










