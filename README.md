# Inventory Management System

A simple and extensible inventory management system for a small grocery store, built with React, Node.js, Express, and PostgreSQL.

## Features

- ✅ Add new grocery items (name, category, quantity, price, expiration date)
- ✅ Update item details
- ✅ Delete items
- ✅ View all items with search and filtering
- ✅ Filter by category and low stock items
- ✅ Visual indicators for low stock items (quantity < 10)

## Tech Stack

- **Frontend**: React, React Router, CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

### 1. Database Setup

1. Make sure PostgreSQL is installed and running
2. Create a new database:
   ```sql
   CREATE DATABASE inventory_db;
   ```
3. Run the schema file to create tables:
   ```bash
   psql -U postgres -d inventory_db -f backend/database/schema.sql
   ```
   Or connect to your database and run the SQL commands from `backend/database/schema.sql`

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your database credentials:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=inventory_db
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The app will open in your browser at `http://localhost:3000`

## Project Structure

```
Inventory management system/
├── backend/
│   ├── database/
│   │   └── schema.sql          # Database schema and sample data
│   ├── routes/
│   │   └── items.js            # API routes for items
│   ├── db.js                   # PostgreSQL connection
│   ├── server.js               # Express server setup
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js       # Navigation header
│   │   │   ├── ItemList.js     # Main items listing page
│   │   │   ├── ItemForm.js     # Add/Edit item form
│   │   │   └── SearchFilters.js # Search and filter component
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── .gitignore
└── README.md
```

## API Endpoints

- `GET /api/items` - Get all items (supports query params: `search`, `category`, `lowStock`)
- `GET /api/items/:id` - Get a single item by ID
- `POST /api/items` - Create a new item
- `PUT /api/items/:id` - Update an item
- `DELETE /api/items/:id` - Delete an item
- `GET /api/items/meta/categories` - Get all unique categories

## Usage

1. **View Items**: Navigate to the home page to see all items in a table format
2. **Add Item**: Click "Add Item" button and fill in the form
3. **Edit Item**: Click "Edit" on any item row
4. **Delete Item**: Click "Delete" on any item row (confirmation required)
5. **Search**: Use the search box to filter by name or category
6. **Filter**: Use the category dropdown or "Low Stock Only" checkbox

## Low Stock Indicator

Items with quantity less than 10 are highlighted in yellow and marked with red text for easy identification.

## Future Extensions

This system is designed to be easily extensible. Some ideas for future enhancements:

- User authentication and authorization
- Barcode scanning
- Inventory reports and analytics
- Supplier management
- Purchase orders
- Sales tracking
- Expiration date alerts
- Bulk import/export
- Image uploads for items

## License

This project is open source and available for educational purposes.











