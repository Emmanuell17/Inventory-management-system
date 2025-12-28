const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');
const itemsRouter = require('./routes/items');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
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

// Test database connection on startup
db.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('⚠️  Please check your .env file and ensure PostgreSQL is running');
    console.error('⚠️  Server will still start, but database operations will fail');
  } else {
    console.log('✅ Database connection successful');
    // Verify grocery_items table exists
    db.query('SELECT COUNT(*) FROM grocery_items', (err, res) => {
      if (err) {
        console.warn('⚠️  grocery_items table may not exist yet');
      } else {
        console.log(`📦 grocery_items table ready (${res.rows[0].count} items)`);
      }
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});


