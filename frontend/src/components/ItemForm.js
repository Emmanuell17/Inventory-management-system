import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './ItemForm.css';
import { GROCERY_CATEGORIES } from '../constants';
import { getItem, createItem, updateItem } from '../services/firestoreService';

// Log categories on load to verify they're correct
console.log('Available categories:', GROCERY_CATEGORIES);

function ItemForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    category: 'Fruits', // Default to first category
    customCategory: '',
    quantity: '',
    price: '',
    expiration_date: '',

    // Reorder configuration (used by reorder suggestions)
    avg_daily_usage: '1', // units/day
    lead_time_days: '7', // supplier lead time
    safety_days: '2', // buffer days
    min_order_qty: '1', // supplier minimum order quantity
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit && currentUser?.email) {
      fetchItem();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currentUser]);

  const fetchItem = async () => {
    if (!currentUser?.email) return;
    
    try {
      setLoading(true);
      const data = await getItem(id, currentUser.email);
      // Check if category is in predefined list, otherwise set to "Other"
      const isPredefinedCategory = GROCERY_CATEGORIES.includes(data.category);
      setFormData({
        name: data.name || '',
        category: isPredefinedCategory ? data.category : 'Other',
        customCategory: isPredefinedCategory ? '' : data.category,
        quantity: data.quantity || '',
        price: data.price || '',
        expiration_date: data.expiration_date ? data.expiration_date.split('T')[0] : '',

        avg_daily_usage: data.avg_daily_usage != null ? String(data.avg_daily_usage) : '1',
        lead_time_days: data.lead_time_days != null ? String(data.lead_time_days) : '7',
        safety_days: data.safety_days != null ? String(data.safety_days) : '2',
        min_order_qty: data.min_order_qty != null ? String(data.min_order_qty) : '1',
      });
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching item:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resolvedCategory = formData.category === 'Other'
    ? formData.customCategory || ''
    : formData.category;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        category: resolvedCategory,
        quantity: parseInt(formData.quantity, 10),
        price: parseFloat(formData.price),
        expiration_date: formData.expiration_date || null,

        avg_daily_usage: parseFloat(formData.avg_daily_usage),
        lead_time_days: parseFloat(formData.lead_time_days),
        safety_days: parseFloat(formData.safety_days),
        min_order_qty: parseInt(formData.min_order_qty, 10),
      };

      if (isEdit) {
        await updateItem(id, payload, currentUser.email);
      } else {
        await createItem(payload, currentUser.email);
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      console.error('Error saving item:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return <div className="loading">Loading item...</div>;
  }

  return (
    <div className="item-form-container">
      <div className="form-header">
        <h2>{isEdit ? 'Edit Item' : 'Add New Item'}</h2>
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
          Cancel
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="item-form">
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Milk, Bread, Apples"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {GROCERY_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {formData.category === 'Other' && (
            <input
              type="text"
              name="customCategory"
              value={formData.customCategory}
              onChange={handleChange}
              placeholder="Enter custom category name"
              required
              style={{ marginTop: '0.5rem' }}
            />
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="quantity">Quantity *</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="0"
              placeholder="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price ($) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="expiration_date">Expiration Date</label>
          <input
            type="date"
            id="expiration_date"
            name="expiration_date"
            value={formData.expiration_date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="avg_daily_usage">Reorder Settings (optional but recommended)</label>
          <div className="form-row" style={{ marginTop: '0.5rem' }}>
            <div className="form-group">
              <label htmlFor="avg_daily_usage">Avg daily usage (units/day)</label>
              <input
                type="number"
                id="avg_daily_usage"
                name="avg_daily_usage"
                value={formData.avg_daily_usage}
                onChange={handleChange}
                min="0"
                step="0.1"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lead_time_days">Lead time (days)</label>
              <input
                type="number"
                id="lead_time_days"
                name="lead_time_days"
                value={formData.lead_time_days}
                onChange={handleChange}
                min="0"
                step="1"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="safety_days">Safety buffer (days)</label>
              <input
                type="number"
                id="safety_days"
                name="safety_days"
                value={formData.safety_days}
                onChange={handleChange}
                min="0"
                step="1"
              />
            </div>
            <div className="form-group">
              <label htmlFor="min_order_qty">Min order qty</label>
              <input
                type="number"
                id="min_order_qty"
                name="min_order_qty"
                value={formData.min_order_qty}
                onChange={handleChange}
                min="1"
                step="1"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (isEdit ? 'Update Item' : 'Add Item')}
          </button>
          <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ItemForm;


