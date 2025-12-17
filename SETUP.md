# Quick Setup Guide

## Step 1: Set up the Database

1. Make sure PostgreSQL is installed and running
2. Create the database:
   ```bash
   psql -U postgres
   ```
   Then in psql:
   ```sql
   CREATE DATABASE inventory_db;
   \q
   ```

3. Run the schema:
   ```bash
   psql -U postgres -d inventory_db -f backend/database/schema.sql
   ```

## Step 2: Configure Backend

1. Go to backend folder:
   ```bash
   cd backend
   ```

2. Create `.env` file (copy from example):
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` with your database credentials:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=inventory_db
   DB_USER=postgres
   DB_PASSWORD=your_actual_password
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```
   
   You should see:
   - ✅ Server is running on port 5000
   - ✅ Database connection successful

## Step 3: Start Frontend

1. Open a NEW terminal window
2. Go to frontend folder:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the React app:
   ```bash
   npm start
   ```

The app should automatically open in your browser at `http://localhost:3000`

## Troubleshooting

### "Safari cannot connect to the server"
- Make sure the backend is running (check terminal for "Server is running on port 5000")
- Check if database connection is successful
- Verify `.env` file exists and has correct credentials

### Database connection errors
- Make sure PostgreSQL is running: `brew services list` (on Mac)
- Check your database password in `.env`
- Verify database exists: `psql -U postgres -l`

### Port already in use
- Change PORT in `.env` to a different number (e.g., 5001)
- Or kill the process using port 5000







