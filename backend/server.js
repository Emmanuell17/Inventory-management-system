const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');
const itemsRouter = require('./routes/items');
const { initializeDatabase } = require('./database/init');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS configuration - allow requests from Vercel frontend and localhost
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:3002',
      'http://localhost:3000',
      process.env.FRONTEND_URL, // Vercel frontend URL
      /\.vercel\.app$/, // All Vercel preview deployments
    ].filter(Boolean);
    
    // Check if origin matches allowed patterns
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed;
      } else if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      // In development, allow all origins for easier testing
      if (process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/items', itemsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize database and start server
async function startServer() {
  // Test database connection first
  try {
    await db.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    const dbSource = process.env.DATABASE_URL ? 'Render PostgreSQL' : 'Local PostgreSQL';
    console.log(`📊 Database source: ${dbSource}`);
    
    // Initialize database schema (creates tables if they don't exist)
    await initializeDatabase();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    if (process.env.DATABASE_URL) {
      console.error('⚠️  Please check your DATABASE_URL environment variable (Render PostgreSQL)');
    } else {
      console.error('⚠️  Please check your DB_* environment variables and ensure PostgreSQL is running');
    }
    console.error('⚠️  Server will still start, but database operations will fail');
  }
  
  // Start server
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    if (process.env.NODE_ENV === 'production') {
      console.log(`📡 API available at ${process.env.RENDER_EXTERNAL_URL || 'https://your-backend.onrender.com'}/api`);
    } else {
      console.log(`📡 API available at http://localhost:${PORT}/api`);
    }
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Start the server
startServer();


