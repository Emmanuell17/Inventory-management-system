import React, { useState, useEffect } from 'react';
import './SearchFilters.css';

function SearchFilters({ filters, setFilters, searchInput, setSearchInput, userEmail, refreshTrigger }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (userEmail) {
      fetchCategories();
    }
  }, [userEmail, refreshTrigger]);

  const fetchCategories = async () => {
    if (!userEmail) return;
    
    try {
      const response = await fetch('/api/items/meta/categories', {
        headers: {
          'x-user-email': userEmail
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setFilters(prev => ({
        ...prev,
        search: searchInput
      }));
    }
  };

  const handleChange = (field, value) => {
    if (field === 'search') {
      // Update input value but don't trigger search yet
      setSearchInput(value);
    } else {
      // Other filters update immediately
      setFilters(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <div className="search-filters">
      <div className="filter-group">
        <label htmlFor="search">Search</label>
        <input
          type="text"
          id="search"
          placeholder="Search by name or category... (Press Enter)"
          value={searchInput}
          onChange={(e) => handleChange('search', e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
      </div>

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

      <div className="filter-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filters.lowStock}
            onChange={(e) => handleChange('lowStock', e.target.checked)}
          />
          <span>Low Stock Only</span>
        </label>
      </div>

      {(filters.search || filters.category || filters.lowStock) && (
        <button
          className="btn-clear"
          onClick={() => {
            setSearchInput('');
            setFilters({ search: '', category: '', lowStock: false });
          }}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

export default SearchFilters;


