import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiUsers, FiCreditCard } from 'react-icons/fi';
import './Landing.css';

const Landing: React.FC = () => {
  return (
    <div className="landing-wrapper">
      {/* HUD Background Effect */}
      <div className="hud-overlay">
        <div className="grid-pattern"></div>
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
      </div>

      <nav className="landing-nav">
        <div className="nav-container">
          <div className="landing-logo">
            <img src="/logo.svg" alt="Logo" width="32" height="32" style={{ marginRight: '10px' }} />
            NCCF PORTAL
          </div>
          <div className="nav-actions">
            <Link to="/login" className="nav-btn-text">Sign In</Link>
            <Link to="/signup" className="nav-btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="landing-main">
        <section className="hero-section">
          <div className="hero-content">
            <div className="badge-unique">
              <span>Platform 2.0</span>
            </div>
            <h1 className="hero-title">
              United in <span className="accent-text">Service</span>,<br />
              Excellence in <span className="accent-text">Living</span>.
            </h1>
            <p className="hero-subtitle">
              The official portal for the Nigeria Christian Corpers' Fellowship. 
              Streamlining room allocations, payment verifications, and community management.
            </p>
            <div className="hero-btns">
              <Link to="/signup" className="hero-btn-main">
                Join the Fellowship <FiArrowRight />
              </Link>
              <Link to="/rooms" className="hero-btn-sub">
                Browse Rooms
              </Link>
            </div>
          </div>
        </section>

        <section className="features-minimal">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <FiShield />
              </div>
              <h3>Secure Allocation</h3>
              <p>Automated room assignments based on transparent verification.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <FiCreditCard />
              </div>
              <h3>Instant Verification</h3>
              <p>Upload your receipts and get verified within minutes by our admin team.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <FiUsers />
              </div>
              <h3>Central Community</h3>
              <p>A unified space for all Christian Corpers to manage their stay and contributions.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-line"></div>
        <p>© 2026 NCCF Nigeria. Simple. Unique. Unified.</p>
      </footer>
    </div>
  );
};

export default Landing;
