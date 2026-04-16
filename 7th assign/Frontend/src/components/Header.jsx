import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquarePlus, Activity } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  return (
    <header className="glass" style={{ padding: '16px 0', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '8px' }}>
            <Activity size={24} color="white" />
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>EduReview</h1>
        </Link>
        <nav>
          {location.pathname === '/' ? (
            <Link to="/submit" style={{ textDecoration: 'none' }}>
              <button className="btn-primary">
                <MessageSquarePlus size={18} />
                Submit Feedback
              </button>
            </Link>
          ) : (
            <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>
              Back to Dashboard
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
