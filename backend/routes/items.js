const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all items with optional filters
router.get('/', async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'];
    
    if (!userEmail) {
      return res.status(401).json({ error: 'User email is required' });
    }

    const { category, search, lowStock } = req.query;
    let query = 'SELECT * FROM grocery_items WHERE user_email = $1';
    const params = [userEmail];
    let paramCount = 1;

    if (search) {
      paramCount++;
      query += ` AND (name ILIKE $${paramCount} OR category ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }

    if (lowStock === 'true') {
      query += ' AND quantity < 10';
    }

    query += ' ORDER BY name ASC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Get single item by ID
router.get('/:id', async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'];
    
    if (!userEmail) {
      return res.status(401).json({ error: 'User email is required' });
    }

    const { id } = req.params;
    const result = await db.query(
      'SELECT * FROM grocery_items WHERE id = $1 AND user_email = $2', 
      [id, userEmail]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Create new item
router.post('/', async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'];
    
    if (!userEmail) {
      return res.status(401).json({ error: 'User email is required' });
    }

    const { name, category, quantity, price, expiration_date } = req.body;
    
    if (!name || !category || quantity === undefined || price === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await db.query(
      'INSERT INTO grocery_items (name, category, quantity, price, expiration_date, user_email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, category, quantity, price, expiration_date || null, userEmail]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// Update item
router.put('/:id', async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'];
    
    if (!userEmail) {
      return res.status(401).json({ error: 'User email is required' });
    }

    const { id } = req.params;
    const { name, category, quantity, price, expiration_date } = req.body;
    
    const result = await db.query(
      'UPDATE grocery_items SET name = $1, category = $2, quantity = $3, price = $4, expiration_date = $5 WHERE id = $6 AND user_email = $7 RETURNING *',
      [name, category, quantity, price, expiration_date || null, id, userEmail]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Delete item
router.delete('/:id', async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'];
    
    if (!userEmail) {
      return res.status(401).json({ error: 'User email is required' });
    }

    const { id } = req.params;
    const result = await db.query(
      'DELETE FROM grocery_items WHERE id = $1 AND user_email = $2 RETURNING *', 
      [id, userEmail]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json({ message: 'Item deleted successfully', item: result.rows[0] });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Get all categories
router.get('/meta/categories', async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'];
    
    if (!userEmail) {
      return res.status(401).json({ error: 'User email is required' });
    }

    const result = await db.query(
      'SELECT DISTINCT category FROM grocery_items WHERE user_email = $1 ORDER BY category ASC',
      [userEmail]
    );
    res.json(result.rows.map(row => row.category));
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;


