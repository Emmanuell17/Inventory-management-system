import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <h1>Inventory Management</h1>
        </Link>
        <nav>
          <Link to="/" className="nav-link">Items</Link>
          <Link to="/add" className="nav-link nav-button">+ Add Item</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;





