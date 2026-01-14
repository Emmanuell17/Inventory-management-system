import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './ItemList.css';
import SearchFilters from './SearchFilters';
import AnimatedList from './AnimatedList';
import { getItems, deleteItem } from '../services/firestoreService';

function ItemList() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    lowStock: false
  });
  const [searchInput, setSearchInput] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch items when filters change or user changes
  useEffect(() => {
    if (currentUser?.email) {
      fetchItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentUser]);

  const fetchItems = async () => {
    if (!currentUser?.email) return;
    
    try {
      setLoading(true);
      const data = await getItems(currentUser.email, filters);
      setItems(data);
      setError(null);
      // Trigger categories refresh after items are fetched
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      setError(err.message || 'Failed to fetch items. Please try again.');
      console.error('❌ Error fetching items:', err);
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

  const handleDelete = async (itemId, itemName) => {
    if (!window.confirm(`Are you sure you want to delete "${itemName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteItem(itemId, currentUser.email);
      // Refresh the items list after deletion
      fetchItems();
    } catch (err) {
      alert(`Error deleting item: ${err.message}`);
      console.error('Error deleting item:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading items...</div>;
  }

  if (error) {
    return (
      <div className="item-list-container">
        <div className="error">
          <h3>⚠️ Error</h3>
          <p>{error}</p>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
            Please check your Firebase configuration and try again.
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
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        userEmail={currentUser?.email}
        refreshTrigger={refreshTrigger}
      />

      {items.length === 0 ? (
        <div className="empty-state">
          <p>No items found. Add your first item to get started!</p>
        </div>
      ) : (
        <div className="animated-items-container">
          <AnimatedList
            items={items}
            onItemSelect={(item) => {
              // Navigate to edit page when item is selected
              navigate(`/edit/${item.id}`);
            }}
            renderItem={(item, index, isSelected) => (
              <div className={`animated-item-card ${isLowStock(item.quantity) ? 'low-stock' : ''} ${isSelected ? 'selected' : ''}`}>
                <div className="item-card-header">
                  <h3 className="item-name">{item.name}</h3>
                  {isLowStock(item.quantity) ? (
                    <span className="status warning">Low stock</span>
                  ) : (
                    <span className="status ok">In stock</span>
                  )}
                </div>
                <div className="item-card-details">
                  <div className="item-detail">
                    <span className="detail-label">Category:</span>
                    <span className="detail-value">{item.category}</span>
                  </div>
                  <div className="item-detail">
                    <span className="detail-label">Quantity:</span>
                    <span className={`detail-value ${isLowStock(item.quantity) ? 'quantity-low' : ''}`}>
                      {item.quantity}
                    </span>
                  </div>
                  <div className="item-detail">
                    <span className="detail-label">Price:</span>
                    <span className="detail-value">{formatPrice(item.price)}</span>
                  </div>
                  <div className="item-detail">
                    <span className="detail-label">Expiration:</span>
                    <span className="detail-value">{formatDate(item.expiration_date)}</span>
                  </div>
                </div>
                <div className="item-card-actions">
                  <Link 
                    to={`/edit/${item.id}`} 
                    className="btn btn-secondary btn-small"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id, item.name);
                    }} 
                    className="btn btn-danger btn-small"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
            showGradients={true}
            enableArrowNavigation={true}
            displayScrollbar={true}
          />
        </div>
      )}
    </div>
  );
}

export default ItemList;


