const { Pool } = require('pg');
require('dotenv').config();

// Support both DATABASE_URL (Render/Heroku) and individual DB variables (local/dev)
const poolConfig = process.env.DATABASE_URL
  ? {
      // Use connection string (Render PostgreSQL provides this)
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // Required for Render PostgreSQL
      }
    }
  : {
      // Use individual variables (local development)
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'inventory_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      ssl: false // No SSL for local development
    };

const pool = new Pool(poolConfig);

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
  if (process.env.DATABASE_URL) {
    console.log('📊 Using DATABASE_URL connection (Render/Production)');
  } else {
    console.log('📊 Using individual DB variables (Local/Development)');
  }
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  // Don't exit - let the app handle the error gracefully
});

module.exports = pool;









