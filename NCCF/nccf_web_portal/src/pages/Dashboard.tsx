import {
  FiHome,
  FiCheckCircle,
  FiClock,
  FiUser,
  FiArrowRight,
  FiBell,
  FiZap,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const stats = [
    {
      label: "Total Rooms",
      value: "18",
      icon: FiHome,
      color: "from-blue-500 to-indigo-600",
      shadow: "rgba(59, 130, 246, 0.5)",
    },
    {
      label: "Verified Payments",
      value: "124",
      icon: FiCheckCircle,
      color: "from-emerald-500 to-teal-600",
      shadow: "rgba(16, 185, 129, 0.5)",
    },
    {
      label: "Pending Verifications",
      value: "12",
      icon: FiClock,
      color: "from-amber-500 to-orange-600",
      shadow: "rgba(245, 158, 11, 0.5)",
    },
  ];

  const quickActions = [
    {
      name: "Browse Rooms",
      path: "/rooms",
      desc: "Secure your spot in our premium hostels",
      icon: <FiHome />,
    },
    {
      name: "Verify Payment",
      path: "/verify-payment",
      desc: "Fast-track your registration process",
      icon: <FiCheckCircle />,
    },
    {
      name: "Update Profile",
      path: "/profile",
      desc: "Keep your information up to date",
      icon: <FiUser />,
    },
  ];

  return (
    <div className="dashboard-container">
      {/* Dynamic Background Elements */}
      <div className="bg-blob bg-blob-1"></div>
      <div className="bg-blob bg-blob-2"></div>

      <div className="dashboard-content">
        {/* Top Navigation / Header */}
        <header className="dashboard-header">
          <div className="header-welcome">
            <h1>
              Welcome to <span className="gradient-text">NCCF Portal</span>
            </h1>
            <p>
              Manage your accommodation and payments with ease and precision.
            </p>
          </div>

          <div className="header-actions">
            <button className="icon-button">
              <FiBell size={20} />
              <span className="notification-dot"></span>
            </button>
            <Link to="/profile" className="profile-pill">
              <div className="avatar-container">
                <FiUser className="text-white" />
              </div>
              <div className="profile-info">
                <p className="role">Member</p>
                <p className="status">Active Profile</p>
              </div>
            </Link>
          </div>
        </header>

        {/* Highlight Banner */}
        <div className="feature-banner">
          <div className="banner-content">
            <div className="banner-text">
              <div className="tag">
                <FiZap className="text-yellow-400" />
                <span>Live Update</span>
              </div>
              <h2>
                Your Room Allocation <br /> is currently in progress.
              </h2>
              <p>
                We are processing applications based on verified payments. Check
                your status and secure your space now.
              </p>
              <div className="banner-actions">
                <button className="btn-white">Verify Status Now</button>
                <Link to="/rooms" className="btn-outline">
                  Learn More
                </Link>
              </div>
            </div>

            {/* Visual Element for Banner */}
            <div className="banner-visual">
              <div className="visual-box">
                <FiHome />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card">
              <div
                className="stat-glow"
                style={{ background: stat.shadow }}
              ></div>
              <div className="stat-inner">
                <div
                  className={`stat-icon-wrap bg-gradient-to-br ${stat.color}`}
                >
                  <stat.icon size={28} className="text-white" />
                </div>
                <div className="stat-info">
                  <p className="label">{stat.label}</p>
                  <p className="value">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions Title */}
        <div className="section-header">
          <h2>Instant Access</h2>
          <div className="section-line"></div>
        </div>

        {/* Action Cards */}
        <div className="actions-grid">
          {quickActions.map((action, i) => (
            <Link key={i} to={action.path} className="action-card">
              <div className="action-top">
                <div className="action-icon-box">{action.icon}</div>
                <FiArrowRight className="arrow-icon" size={20} />
              </div>
              <div className="action-body">
                <h3>{action.name}</h3>
                <p>{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Footer Section */}
        <footer className="dashboard-footer">
          <p>
            © 2026 Nigeria Christian Corpers' Fellowship. All rights reserved.
          </p>
          <nav className="footer-nav">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Support Center</a>
          </nav>
        </footer>
      </div>
    </div>
  );
}
