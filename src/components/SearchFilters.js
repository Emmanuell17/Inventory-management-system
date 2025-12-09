import React, { useState, useEffect } from 'react';
import './SearchFilters.css';

function SearchFilters({ filters, setFilters }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/items/meta/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="search-filters">
      <div className="filter-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {filters.category && (
        <button
          className="btn-clear"
          onClick={() => {
            setFilters({ category: '' });
          }}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

export default SearchFilters;


