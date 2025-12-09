import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

function Header() {
  const { currentUser, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <h1>Veltra Stock</h1>
        </Link>
        <nav>
          {currentUser && (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/add" className="nav-link nav-button">+ Add Item</Link>
              {currentUser.photoURL && (
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName || 'User'} 
                  className="user-avatar"
                />
              )}
              <span className="user-name">{currentUser.displayName || currentUser.email}</span>
            </>
          )}
          {!currentUser ? (
            <Link to="/" className="nav-link">Sign In</Link>
          ) : (
            <button className="nav-link nav-button secondary" onClick={handleSignOut}>
              Sign Out
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;






