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
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </button>
          ) : (
            <>
              <button 
                className="btn btn-primary" 
                onClick={handleSignIn}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in with Google'}
              </button>
              {error && <p className="error-message">{error}</p>}
            </>
          )}
        </div>
      </div>
      <div className="home-grid">
        <div className="card">
          <h3>Add & manage items</h3>
          <p>Enter grocery items with name, category, quantity, price, and expiration.</p>
        </div>
        <div className="card">
          <h3>Search & filter</h3>
          <p>Find items quickly by category, search, or low-stock filter.</p>
        </div>
        <div className="card">
          <h3>Low-stock alerts</h3>
          <p>Highlight items that need restocking so you never run out.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;

