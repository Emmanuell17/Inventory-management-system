import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getItems } from '../services/firestoreService';
import { addDays, getReorderAdvice } from '../utils/reorder';
import './ReorderSuggestions.css';

const urgencyToStatusClass = (urgency) => {
  switch (urgency) {
    case 'critical':
      return 'danger';
    case 'soon':
      return 'warning';
    default:
      return 'ok';
  }
};

const formatNumber = (value, decimals = 2) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return 'N/A';
  return num.toFixed(decimals);
};

function ReorderSuggestions() {
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.email) return;

      try {
        setLoading(true);
        setError(null);
        const data = await getItems(currentUser.email);
        setItems(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch inventory');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser?.email]);

  const suggestions = useMemo(() => {
    return items
      .map((item) => {
        const advice = getReorderAdvice(item);
        if (advice.reorderQty <= 0) return null;

        const restockDate = addDays(new Date(), Math.round(advice.leadTimeDays));
        const estCost = (Number(item.price) || 0) * advice.reorderQty;

        return {
          item,
          advice,
          restockDate,
          estCost,
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        // Most urgent first (critical before soon)
        const score = (u) => (u === 'critical' ? 0 : u === 'soon' ? 1 : 2);
        const sA = score(a.advice.urgency);
        const sB = score(b.advice.urgency);
        if (sA !== sB) return sA - sB;
        return a.advice.daysOfSupply - b.advice.daysOfSupply;
      });
  }, [items]);

  const summary = useMemo(() => {
    const totalReorderQty = suggestions.reduce((acc, s) => acc + s.advice.reorderQty, 0);
    const totalEstCost = suggestions.reduce((acc, s) => acc + s.estCost, 0);
    return { totalReorderQty, totalEstCost };
  }, [suggestions]);

  if (loading) {
    return (
      <div className="reorder-container">
        <div className="loading">Loading reorder suggestions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reorder-container">
        <div className="error">
          <h3>⚠️ Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reorder-container">
      <div className="reorder-header">
        <div>
          <h2>Reorder Suggestions</h2>
          <p className="reorder-subtitle">Based on your reorder settings</p>
        </div>
        <div className="reorder-header-actions">
          <Link to="/dashboard" className="btn btn-secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>

      {suggestions.length === 0 ? (
        <div className="empty-state">
          <p>
            No items need reordering right now. If you want smarter recommendations, edit an item
            and update its reorder settings.
          </p>
        </div>
      ) : (
        <>
          <div className="dashboard-stats">
            <div className="stat-card warning">
              <span className="stat-label">Items to Reorder</span>
              <span className="stat-value">{suggestions.length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Reorder Qty</span>
              <span className="stat-value">{summary.totalReorderQty}</span>
            </div>
            <div className="stat-card danger">
              <span className="stat-label">Est. Purchase Cost</span>
              <span className="stat-value">${formatNumber(summary.totalEstCost, 2)}</span>
            </div>
          </div>

          <div className="reorder-list">
            {suggestions.map(({ item, advice, restockDate, estCost }) => {
              const restockStr = restockDate.toLocaleDateString();
              const urgencyClass = urgencyToStatusClass(advice.urgency);

              const confidenceNote =
                advice.confidence === 'low'
                  ? 'Using defaults; update settings for better accuracy.'
                  : 'Based on your saved settings.';

              return (
                <div key={item.id} className={`reorder-card ${urgencyClass}`}>
                  <div className="reorder-card-top">
                    <div>
                      <h3 className="reorder-item-name">{item.name}</h3>
                      <div className="reorder-meta">
                        <span className={`status ${urgencyClass}`}>
                          {advice.urgency === 'critical'
                            ? 'Critical'
                            : advice.urgency === 'soon'
                              ? 'Reorder Soon'
                              : 'Reorder'}
                        </span>
                        <span className="reorder-meta-text">Category: {item.category}</span>
                      </div>
                    </div>

                    <div className="reorder-card-actions">
                      <Link to={`/edit/${item.id}`} className="btn btn-secondary btn-small">
                        Edit Settings
                      </Link>
                    </div>
                  </div>

                  <div className="reorder-details">
                    <div className="reorder-detail">
                      <span className="detail-label">On Hand</span>
                      <span className="detail-value">{advice.currentQty}</span>
                    </div>
                    <div className="reorder-detail">
                      <span className="detail-label">Est. Days of Supply</span>
                      <span className="detail-value">{Number.isFinite(advice.daysOfSupply) ? advice.daysOfSupply.toFixed(1) : 'N/A'}</span>
                    </div>
                    <div className="reorder-detail">
                      <span className="detail-label">Reorder Threshold</span>
                      <span className="detail-value">{advice.reorderPointDays.toFixed(0)} days</span>
                    </div>
                    <div className="reorder-detail">
                      <span className="detail-label">Recommended Reorder Qty</span>
                      <span className="detail-value">{advice.reorderQty}</span>
                    </div>
                    <div className="reorder-detail">
                      <span className="detail-label">Est. Restock Date</span>
                      <span className="detail-value">{restockStr}</span>
                    </div>
                    <div className="reorder-detail">
                      <span className="detail-label">Est. Cost</span>
                      <span className="detail-value">${formatNumber(estCost, 2)}</span>
                    </div>
                  </div>

                  <div className="reorder-reason">
                    <p className="reorder-reason-title">Why this recommendation</p>
                    <p className="reorder-reason-text">
                      Avg daily usage: {advice.dailyUsage.toFixed(1)} units/day, lead time: {advice.leadTimeDays.toFixed(0)} days,
                      safety buffer: {advice.safetyDays.toFixed(0)} days. {confidenceNote}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default ReorderSuggestions;

