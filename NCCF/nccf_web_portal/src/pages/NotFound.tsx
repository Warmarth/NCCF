import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft } from 'react-icons/fi';
import './NotFound.css';

const NotFound: React.FC = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-bg">
        <div className="glow-circle glow-circle-1"></div>
        <div className="glow-circle glow-circle-2"></div>
      </div>
      
      <div className="not-found-content">
        <div className="error-code">404</div>
        <h1 className="error-title">Page Not Found</h1>
        <p className="error-message">
          Oops! The page you are looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            onClick={() => window.history.back()} 
            className="back-home-btn" 
            style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
          >
            <FiArrowLeft size={20} />
            Go Back
          </button>
          
          <Link to="/" className="back-home-btn">
            <FiHome size={20} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
