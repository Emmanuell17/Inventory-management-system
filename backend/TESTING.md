# Backend API Testing Guide

## Quick Test Commands

### 1. Health Check (Simplest Test)
```bash
curl http://localhost:5000/api/health
```
Expected response: `{"status":"ok","message":"Server is running"}`

### 2. Get All Items
```bash
curl http://localhost:5000/api/items
```

### 3. Get Single Item (replace `1` with actual ID)
```bash
curl http://localhost:5000/api/items/1
```

### 4. Create New Item
```bash
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bananas",
    "category": "Produce",
    "quantity": 30,
    "price": 2.99,
    "expiration_date": "2024-12-20"
  }'
```

### 5. Update Item (replace `1` with actual ID)
```bash
curl -X PUT http://localhost:5000/api/items/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Item Name",
    "category": "Updated Category",
    "quantity": 50,
    "price": 5.99,
    "expiration_date": "2024-12-25"
  }'
```

### 6. Delete Item (replace `1` with actual ID)
```bash
curl -X DELETE http://localhost:5000/api/items/1
```

### 7. Search Items
```bash
curl "http://localhost:5000/api/items?search=milk"
```

### 8. Filter by Category
```bash
curl "http://localhost:5000/api/items?category=Dairy"
```

### 9. Low Stock Filter
```bash
curl "http://localhost:5000/api/items?lowStock=true"
```

### 10. Get Categories
```bash
curl http://localhost:5000/api/items/meta/categories
```

## Automated Test Script

Run the automated test script:

```bash
cd backend
chmod +x test-api.sh
./test-api.sh
```

Or if you prefer:
```bash
bash backend/test-api.sh
```

## Using Browser

You can also test GET requests directly in your browser:
- Health: http://localhost:5000/api/health
- All Items: http://localhost:5000/api/items
- Categories: http://localhost:5000/api/items/meta/categories

## Using Postman or Insomnia

1. **Import these endpoints:**
   - GET `http://localhost:5000/api/health`
   - GET `http://localhost:5000/api/items`
   - GET `http://localhost:5000/api/items/:id`
   - POST `http://localhost:5000/api/items`
   - PUT `http://localhost:5000/api/items/:id`
   - DELETE `http://localhost:5000/api/items/:id`

2. **For POST/PUT requests, set Headers:**
   ```
   Content-Type: application/json
   ```

3. **Example POST body:**
   ```json
   {
     "name": "Test Item",
     "category": "Test Category",
     "quantity": 100,
     "price": 9.99,
     "expiration_date": "2024-12-31"
   }
   ```

## Testing with Node.js Script

Create a file `test.js`:

```javascript
const fetch = require('node-fetch'); // npm install node-fetch@2

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    // Health check
    const health = await fetch(`${BASE_URL}/health`);
    console.log('Health:', await health.json());
    
    // Get all items
    const items = await fetch(`${BASE_URL}/items`);
    console.log('Items:', await items.json());
    
    // Create item
    const newItem = await fetch(`${BASE_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Item',
        category: 'Test',
        quantity: 10,
        price: 5.99
      })
    });
    const created = await newItem.json();
    console.log('Created:', created);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAPI();
```

## Expected Responses

### Success Responses
- **200 OK**: GET, PUT requests
- **201 Created**: POST requests
- **200 OK**: DELETE requests

### Error Responses
- **400 Bad Request**: Missing required fields
- **404 Not Found**: Item doesn't exist
- **500 Internal Server Error**: Database/server error

## Troubleshooting

### "Connection refused"
- Make sure backend is running: `npm run dev` in backend folder
- Check if port 5000 is available

### "Database connection failed"
- Check `.env` file has correct database credentials
- Make sure PostgreSQL is running
- Verify database exists: `psql -U postgres -l`

### Empty array `[]` returned
- Database might be empty (this is normal if you haven't added items)
- Run the schema.sql to add sample data










