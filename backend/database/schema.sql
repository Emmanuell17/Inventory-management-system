-- Create database (run this manually if needed)
-- CREATE DATABASE inventory_db;

-- Create grocery_items table with user_email column for multi-user support
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
);

-- Create indexes for faster searches
CREATE INDEX IF NOT EXISTS idx_grocery_items_category ON grocery_items(category);
CREATE INDEX IF NOT EXISTS idx_grocery_items_name ON grocery_items(name);
CREATE INDEX IF NOT EXISTS idx_grocery_items_user_email ON grocery_items(user_email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
-- Drop trigger if it exists first (PostgreSQL doesn't support IF NOT EXISTS for triggers)
DROP TRIGGER IF EXISTS update_grocery_items_updated_at ON grocery_items;
CREATE TRIGGER update_grocery_items_updated_at BEFORE UPDATE ON grocery_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


