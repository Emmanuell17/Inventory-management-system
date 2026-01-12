# How to Start the Servers

## ⚠️ Important: You Need TWO Terminal Windows

### Terminal 1 - Backend Server

1. Open a terminal window
2. Navigate to backend folder:
   ```bash
   cd "/Users/odu_1/Inventory management system/backend"
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
4. **Wait until you see:**
   ```
   ✅ Server is running on port 5001
   ✅ Database connection successful
   ```
5. **Keep this terminal open** - the server must keep running

### Terminal 2 - Frontend Server

1. Open a **NEW** terminal window (keep Terminal 1 running!)
2. Navigate to frontend folder:
   ```bash
   cd "/Users/odu_1/Inventory management system/frontend"
   ```
3. Start the React app:
   ```bash
   npm start
   ```
4. The browser should open automatically at `http://localhost:3002`

## ✅ Success Indicators

**Backend Terminal Should Show:**
```
✅ Server is running on port 5001
📡 API available at http://localhost:5001/api
✅ Database connection successful
```

**Frontend Terminal Should Show:**
```
Compiled successfully!
webpack compiled successfully
```

**Browser Should Show:**
- The inventory management interface
- Either a list of items or "No items found" message

## 🔍 Troubleshooting

### "Proxy error: ECONNREFUSED"
- **Solution**: Make sure the backend is running in Terminal 1
- Check: `curl http://localhost:5001/api/health` should return JSON

### "Database connection failed"
- Check `.env` file has correct `DB_USER=Emmanuel`
- Make sure PostgreSQL is running

### Frontend shows blank/white screen
- Check browser console (F12) for errors
- Make sure backend is running first

## 🧪 Quick Test

Once both servers are running, test the backend:
```bash
curl http://localhost:5001/api/health
```

Should return: `{"status":"ok","message":"Server is running"}`










