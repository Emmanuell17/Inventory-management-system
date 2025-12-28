#!/bin/bash

# Backend API Testing Script
# Make sure the backend server is running before executing this script

BASE_URL="http://localhost:5000/api"

echo "🧪 Testing Backend API..."
echo "=========================="
echo ""

# Test 1: Health Check
echo "1️⃣ Testing Health Endpoint..."
curl -s "$BASE_URL/health" | python3 -m json.tool || curl -s "$BASE_URL/health"
echo -e "\n"

# Test 2: Get All Items
echo "2️⃣ Testing GET /api/items (Get All Items)..."
curl -s "$BASE_URL/items" | python3 -m json.tool || curl -s "$BASE_URL/items"
echo -e "\n"

# Test 3: Get Categories
echo "3️⃣ Testing GET /api/items/meta/categories..."
curl -s "$BASE_URL/items/meta/categories" | python3 -m json.tool || curl -s "$BASE_URL/items/meta/categories"
echo -e "\n"

# Test 4: Create New Item
echo "4️⃣ Testing POST /api/items (Create New Item)..."
RESPONSE=$(curl -s -X POST "$BASE_URL/items" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Item",
    "category": "Test Category",
    "quantity": 100,
    "price": 9.99,
    "expiration_date": "2024-12-31"
  }')
echo "$RESPONSE" | python3 -m json.tool || echo "$RESPONSE"

# Extract ID from response (if successful)
ITEM_ID=$(echo "$RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
echo -e "\n"

if [ ! -z "$ITEM_ID" ]; then
  echo "✅ Item created with ID: $ITEM_ID"
  echo ""
  
  # Test 5: Get Single Item
  echo "5️⃣ Testing GET /api/items/$ITEM_ID (Get Single Item)..."
  curl -s "$BASE_URL/items/$ITEM_ID" | python3 -m json.tool || curl -s "$BASE_URL/items/$ITEM_ID"
  echo -e "\n"
  
  # Test 6: Update Item
  echo "6️⃣ Testing PUT /api/items/$ITEM_ID (Update Item)..."
  curl -s -X PUT "$BASE_URL/items/$ITEM_ID" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Updated Test Item",
      "category": "Updated Category",
      "quantity": 150,
      "price": 12.99,
      "expiration_date": "2025-01-31"
    }' | python3 -m json.tool || curl -s -X PUT "$BASE_URL/items/$ITEM_ID" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Updated Test Item",
      "category": "Updated Category",
      "quantity": 150,
      "price": 12.99,
      "expiration_date": "2025-01-31"
    }'
  echo -e "\n"
  
  # Test 7: Delete Item
  echo "7️⃣ Testing DELETE /api/items/$ITEM_ID (Delete Item)..."
  curl -s -X DELETE "$BASE_URL/items/$ITEM_ID" | python3 -m json.tool || curl -s -X DELETE "$BASE_URL/items/$ITEM_ID"
  echo -e "\n"
else
  echo "⚠️  Could not create item, skipping individual item tests"
fi

# Test 8: Search/Filter
echo "8️⃣ Testing GET /api/items?search=milk (Search)..."
curl -s "$BASE_URL/items?search=milk" | python3 -m json.tool || curl -s "$BASE_URL/items?search=milk"
echo -e "\n"

# Test 9: Filter by Category
echo "9️⃣ Testing GET /api/items?category=Dairy (Filter by Category)..."
curl -s "$BASE_URL/items?category=Dairy" | python3 -m json.tool || curl -s "$BASE_URL/items?category=Dairy"
echo -e "\n"

# Test 10: Low Stock Filter
echo "🔟 Testing GET /api/items?lowStock=true (Low Stock Filter)..."
curl -s "$BASE_URL/items?lowStock=true" | python3 -m json.tool || curl -s "$BASE_URL/items?lowStock=true"
echo -e "\n"

echo "=========================="
echo "✅ Testing Complete!"










