import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ItemList.css';
import SearchFilters from './SearchFilters';

function ItemList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: ''
  });

  // Fetch items when filters change
  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);

      const response = await fetch(`/api/items?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch items: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setItems(data);
      setError(null);
    } catch (err) {
      const errorMsg = err.message.includes('Failed to fetch') || err.message.includes('NetworkError')
        ? 'Cannot connect to server. Please make sure the backend is running on port 5001.'
        : err.message;
      setError(errorMsg);
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price) => `$${parseFloat(price).toFixed(2)}`;
  const isLowStock = (quantity) => quantity < 10;

  if (loading) {
    return <div className="loading">Loading items...</div>;
  }

  if (error) {
    return (
      <div className="item-list-container">
        <div className="error">
          <h3>⚠️ Connection Error</h3>
          <p>{error}</p>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
            Make sure the backend server is running:<br />
            <code style={{ background: '#f0f0f0', padding: '0.25rem 0.5rem', borderRadius: '3px' }}>
              cd backend && npm run dev
            </code>
          </p>
        </div>
      </div>
    );
  }

  const lowStockCount = items.filter(item => isLowStock(item.quantity)).length;
  
  // Calculate total unique categories
  const uniqueCategories = new Set(items.map(item => item.category));
  const totalCategories = uniqueCategories.size;
  
  // Calculate items expiring soon (within next 14 days)
  const today = new Date();
  const twoWeeksFromNow = new Date(today);
  twoWeeksFromNow.setDate(today.getDate() + 14);
  
  const expiringSoonCount = items.filter(item => {
    if (!item.expiration_date) return false;
    const expDate = new Date(item.expiration_date);
    return expDate >= today && expDate <= twoWeeksFromNow;
  }).length;

  return (
    <div className="item-list-container">
      <div className="item-list-header">
        <div>
          <h2>Seller Dashboard</h2>
          <p className="dashboard-subtitle">Manage your grocery inventory</p>
        </div>
        <Link to="/add" className="btn btn-primary">+ Add New Item</Link>
      </div>

      {items.length > 0 && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-label">Total Items</span>
            <span className="stat-value">{items.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Categories</span>
            <span className="stat-value">{totalCategories}</span>
          </div>
          {lowStockCount > 0 && (
            <div className="stat-card warning">
              <span className="stat-label">Low Stock Alerts</span>
              <span className="stat-value">{lowStockCount}</span>
            </div>
          )}
          {expiringSoonCount > 0 && (
            <div className="stat-card danger">
              <span className="stat-label">Expiring Soon</span>
              <span className="stat-value">{expiringSoonCount}</span>
            </div>
          )}
        </div>
      )}

      <SearchFilters 
        filters={filters} 
        setFilters={setFilters}
      />

      {items.length === 0 ? (
        <div className="empty-state">
          <p>No items found. Add your first item to get started!</p>
        </div>
      ) : (
        <div className="items-table-container">
          <table className="items-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Expiration Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className={isLowStock(item.quantity) ? 'low-stock' : ''}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>
                    <span className={isLowStock(item.quantity) ? 'quantity-low' : ''}>
                      {item.quantity}
                    </span>
                  </td>
                  <td>{formatPrice(item.price)}</td>
                  <td>{formatDate(item.expiration_date)}</td>
                  <td>
                    {isLowStock(item.quantity) ? (
                      <span className="status warning">Low stock</span>
                    ) : (
                      <span className="status ok">In stock</span>
                    )}
                  </td>
                  <td>
                    <Link to={`/edit/${item.id}`} className="btn btn-secondary btn-small">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ItemList;


