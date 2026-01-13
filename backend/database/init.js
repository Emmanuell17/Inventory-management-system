const db = require('../db');
const fs = require('fs');
const path = require('path');

/**
 * Initialize database schema
 * This function creates the grocery_items table if it doesn't exist
 * Safe to run multiple times (uses IF NOT EXISTS)
 */
async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database schema...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    // Split SQL into individual statements and filter out empty/comment-only lines
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await db.query(statement);
        } catch (err) {
          // Ignore "already exists" errors (table, index, function, trigger)
          if (err.code === '42P07' || err.code === '42710' || err.message.includes('already exists')) {
            // This is expected if schema already exists
            continue;
          }
          // Re-throw other errors
          throw err;
        }
      }
    }
    
    console.log('✅ Database schema initialized successfully');
    
    // Verify the table exists
    const result = await db.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_name = 'grocery_items'
    `);
    
    if (result.rows[0].count === '1') {
      console.log('✅ grocery_items table verified');
      
      // Check if there are any items
      const itemCount = await db.query('SELECT COUNT(*) as count FROM grocery_items');
      console.log(`📦 Current items in database: ${itemCount.rows[0].count}`);
    } else {
      console.warn('⚠️  grocery_items table not found after initialization');
    }
    
    return true;
  } catch (error) {
    // If table already exists, that's fine - just log it
    if (error.code === '42P07' || error.message.includes('already exists')) {
      console.log('ℹ️  Database tables already exist, skipping initialization');
      return true;
    }
    
    console.error('❌ Error initializing database:', error.message);
    console.error('⚠️  Server will continue, but database operations may fail');
    return false;
  }
}

module.exports = { initializeDatabase };
