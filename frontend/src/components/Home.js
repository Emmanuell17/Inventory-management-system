import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const { currentUser, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      console.error('Sign in error:', err);
      setError('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="home-hero">
        <p className="badge">Grocery Sellers</p>
        <h1>Veltra Stock</h1>
        <p className="subtitle">
          Simple inventory for grocery store sellers. Track items, quantities, prices,
          and expiration dates with low-stock alerts.
        </p>
        <div className="home-actions">
          {currentUser ? (
            <button className="btn btn-primary btn-cta-large" onClick={() => navigate('/dashboard')}>
              View Inventory
            </button>
          ) : (
            <>
              <button 
                className="btn btn-primary btn-cta-large" 
                onClick={handleSignIn}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Get Started'}
              </button>
              {error && <p className="error-message">{error}</p>}
            </>
          )}
        </div>
      </div>
      <div className="home-grid">
        <div 
          className="card clickable-card" 
          onClick={() => currentUser ? navigate('/dashboard') : handleSignIn()}
        >
          <h3>🧺 Add & Manage Items</h3>
          <p>Add items with quantity, price, and expiration dates.</p>
        </div>
        <div 
          className="card clickable-card" 
          onClick={() => currentUser ? navigate('/dashboard') : handleSignIn()}
        >
          <h3>🔍 Search & Filter</h3>
          <p>Find items instantly by category or stock level.</p>
        </div>
        <div 
          className="card clickable-card" 
          onClick={() => currentUser ? navigate('/dashboard') : handleSignIn()}
        >
          <h3>⚠️ Low-Stock Alerts</h3>
          <p>Get notified before items run out.</p>
        </div>
      </div>

      <div className="who-this-is-for-section">
        <h2 className="section-title">Perfect For</h2>
        <div className="audience-grid">
          <div className="audience-item">
            <div className="audience-icon">🏪</div>
            <h3>Grocery Stores</h3>
            <p>Manage inventory for full-scale grocery operations with ease.</p>
          </div>
          <div className="audience-item">
            <div className="audience-icon">🏬</div>
            <h3>Mini-marts & Kiosks</h3>
            <p>Perfect solution for small retail spaces tracking daily stock.</p>
          </div>
          <div className="audience-item">
            <div className="audience-icon">🛒</div>
            <h3>Market Sellers</h3>
            <p>Keep track of your products and never miss a sale opportunity.</p>
          </div>
          <div className="audience-item">
            <div className="audience-icon">📋</div>
            <h3>Inventory Clerks</h3>
            <p>Streamline your workflow with efficient stock management tools.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

