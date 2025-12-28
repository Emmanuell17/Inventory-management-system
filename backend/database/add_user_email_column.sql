-- Migration: Add user_email column to grocery_items table
-- Run this script to add user-specific inventory support

-- Add user_email column
ALTER TABLE grocery_items 
ADD COLUMN IF NOT EXISTS user_email VARCHAR(255);

-- Create index for faster user-specific queries
CREATE INDEX IF NOT EXISTS idx_grocery_items_user_email ON grocery_items(user_email);

-- Update existing items to have a default user_email (optional - you may want to delete existing items instead)
-- UPDATE grocery_items SET user_email = 'default@example.com' WHERE user_email IS NULL;

-- Make user_email required for new items (optional - uncomment if you want to enforce it)
-- ALTER TABLE grocery_items ALTER COLUMN user_email SET NOT NULL;






