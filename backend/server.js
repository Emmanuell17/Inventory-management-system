const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');
const itemsRouter = require('./routes/items');
const assistantRouter = require('./routes/assistant');
const { initializeDatabase } = require('./database/init');

const app = express();
// Keep default aligned with `frontend/package.json` CRA proxy (http://localhost:5001)
const PORT = process.env.PORT || 5001;

// Middleware
// CORS configuration - allow requests from Vercel frontend and localhost
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      console.log('🌐 CORS: Allowing request with no origin');
      return callback(null, true);
    }
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:3002',
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL, // Vercel frontend URL (if set)
    ].filter(Boolean);
    
    // Vercel patterns (both .vercel.app and custom domains)
    const vercelPatterns = [
      /\.vercel\.app$/, // All Vercel preview deployments (e.g., app-xyz.vercel.app)
      /\.vercel\.app\/$/, // With trailing slash
    ];
    
    // Check if origin matches allowed patterns
    let isAllowed = false;
    
    // Check exact matches first
    if (allowedOrigins.includes(origin)) {
      isAllowed = true;
      console.log(`✅ CORS: Allowed origin (exact match): ${origin}`);
    }
    // Check Vercel patterns
    else if (vercelPatterns.some(pattern => pattern.test(origin))) {
      isAllowed = true;
      console.log(`✅ CORS: Allowed origin (Vercel pattern): ${origin}`);
    }
    // In production, be more permissive for Vercel deployments
    else if (process.env.NODE_ENV === 'production') {
      // Allow any HTTPS origin in production (for flexibility with custom domains)
      // This is safe because we require x-user-email header for authentication
      if (origin.startsWith('https://')) {
        isAllowed = true;
        console.log(`✅ CORS: Allowed origin (HTTPS in production): ${origin}`);
      } else {
        console.warn(`⚠️  CORS: Blocked non-HTTPS origin in production: ${origin}`);
      }
    }
    // In development, allow all origins
    else {
      isAllowed = true;
      console.log(`✅ CORS: Allowed origin (development mode): ${origin}`);
    }
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.error(`❌ CORS: Blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/items', itemsRouter);
app.use('/api/assistant', assistantRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Manual database initialization endpoint (for troubleshooting)
app.post('/api/init-db', async (req, res) => {
  try {
    console.log('🔄 Manual database initialization requested...');
    const result = await initializeDatabase();
    if (result) {
      res.json({ 
        status: 'success', 
        message: 'Database initialized successfully' 
      });
    } else {
      res.status(500).json({ 
        status: 'error', 
        message: 'Database initialization failed' 
      });
    }
  } catch (error) {
    console.error('❌ Manual initialization error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: error.message,
      details: error.code 
    });
  }
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


