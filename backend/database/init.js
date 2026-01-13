const db = require('../db');

/**
 * Initialize database schema
 * This function creates the grocery_items table if it doesn't exist
 * Safe to run multiple times (uses IF NOT EXISTS)
 */
async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database schema...');
    
    // First, check if table already exists
    const tableCheck = await db.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'grocery_items'
    `);
    
    if (tableCheck.rows[0].count === '1') {
      console.log('ℹ️  grocery_items table already exists, verifying structure...');
      // Verify user_email column exists (for migration compatibility)
      try {
        await db.query('SELECT user_email FROM grocery_items LIMIT 1');
        console.log('✅ Table structure verified');
        return true;
      } catch (err) {
        // Column might not exist, but table does - that's okay for now
        console.log('ℹ️  Table exists, continuing...');
        return true;
      }
    }
    
    // Step 1: Create the table
    console.log('📋 Creating grocery_items table...');
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS grocery_items (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          category VARCHAR(100) NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 0,
          price DECIMAL(10, 2) NOT NULL,
          expiration_date DATE,
          user_email VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Table created');
    } catch (tableErr) {
      console.error('❌ Failed to create table:', tableErr.message);
      console.error('Error code:', tableErr.code);
      // Check if table exists anyway (might have been created by another process)
      const checkAfterError = await db.query(`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_name = 'grocery_items'
      `);
      if (checkAfterError.rows[0].count === '1') {
        console.log('ℹ️  Table exists despite error - continuing...');
      } else {
        throw new Error(`Table creation failed: ${tableErr.message}`);
      }
    }
    
    // Step 2: Create indexes (only if table was just created)
    console.log('📊 Creating indexes...');
    try {
      await db.query('CREATE INDEX IF NOT EXISTS idx_grocery_items_category ON grocery_items(category)');
      await db.query('CREATE INDEX IF NOT EXISTS idx_grocery_items_name ON grocery_items(name)');
      await db.query('CREATE INDEX IF NOT EXISTS idx_grocery_items_user_email ON grocery_items(user_email)');
      console.log('✅ Indexes created');
    } catch (err) {
      console.warn('⚠️  Warning creating indexes:', err.message, '(code:', err.code + ')');
      // Continue even if indexes fail
    }
    
    // Step 3: Create the function
    console.log('⚙️  Creating update function...');
    try {
      await db.query(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
        END;
        $$ language 'plpgsql'
      `);
      console.log('✅ Function created');
    } catch (err) {
      console.warn('⚠️  Warning creating function:', err.message, '(code:', err.code + ')');
      // Continue even if function creation fails
    }
    
    // Step 4: Create the trigger (drop first if exists)
    console.log('🔔 Creating trigger...');
    try {
      await db.query('DROP TRIGGER IF EXISTS update_grocery_items_updated_at ON grocery_items');
      await db.query(`
        CREATE TRIGGER update_grocery_items_updated_at 
        BEFORE UPDATE ON grocery_items
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
      `);
      console.log('✅ Trigger created');
    } catch (err) {
      console.warn('⚠️  Warning creating trigger:', err.message, '(code:', err.code + ')');
      // Continue even if trigger fails - table will still work
    }
    
    // Final verification - check if table exists and is accessible
    console.log('🔍 Verifying table...');
    try {
      // First check if table exists in information_schema (check all schemas)
      const result = await db.query(`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_name = 'grocery_items'
      `);
      
      if (result.rows[0].count === '1') {
        console.log('✅ Table found in information_schema');
        // Try to query the table to make sure it's accessible
        try {
          const itemCount = await db.query('SELECT COUNT(*) as count FROM grocery_items');
          console.log('✅ Database schema initialized successfully');
          console.log('✅ grocery_items table verified and accessible');
          console.log(`📦 Current items in database: ${itemCount.rows[0].count}`);
          return true;
        } catch (queryErr) {
          // Table exists but query failed - might be a permission issue
          console.warn('⚠️  Table exists but query failed:', queryErr.message);
          console.warn('⚠️  This might be a permission issue, but table was created');
          return true; // Return true anyway since table exists
        }
      } else {
        throw new Error('Table not found in information_schema after creation');
      }
    } catch (verifyErr) {
      console.error('❌ Table verification failed:', verifyErr.message);
      // Don't throw - let the error handler below check if table actually exists
      throw verifyErr;
    }
  } catch (error) {
    // Log the full error for debugging
    console.error('❌ Error initializing database:', error.message);
    console.error('Error code:', error.code);
    console.error('Error details:', error);
    
    // Check if table exists despite the error
    try {
      const checkResult = await db.query(`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'grocery_items'
      `);
      if (checkResult.rows[0].count === '1') {
        console.log('ℹ️  Table exists despite error - continuing...');
        return true;
      }
    } catch (checkErr) {
      // Ignore check errors
    }
    
    console.error('⚠️  Server will continue, but database operations may fail');
    return false;
  }
}

module.exports = { initializeDatabase };
