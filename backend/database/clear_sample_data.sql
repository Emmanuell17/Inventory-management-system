-- Clear all existing items from the database
-- Run this if you want to remove all sample/default items

DELETE FROM items;

-- Reset the sequence (optional, but keeps IDs clean)
ALTER SEQUENCE items_id_seq RESTART WITH 1;



