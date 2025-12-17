-- Create database (run this manually if needed)
-- CREATE DATABASE inventory_db;

-- Create items table
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    expiration_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_name ON items(name);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
INSERT INTO items (name, category, quantity, price, expiration_date) VALUES
    ('Milk', 'Dairy', 25, 3.99, '2024-12-31'),
    ('Bread', 'Bakery', 15, 2.49, '2024-12-20'),
    ('Apples', 'Produce', 50, 1.99, '2024-12-15'),
    ('Chicken Breast', 'Meat', 8, 7.99, '2024-12-10'),
    ('Eggs', 'Dairy', 30, 4.99, '2024-12-25')
ON CONFLICT DO NOTHING;


