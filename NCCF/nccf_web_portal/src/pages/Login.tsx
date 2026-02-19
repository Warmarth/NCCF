import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import { supabase } from '../lib/supabase';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-blob auth-blob-1"></div>
      <div className="auth-blob auth-blob-2"></div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">NCCF</div>
          <h2>Welcome Back</h2>
          <p>Login to manage your hostel applications</p>
        </div>

        {error && (
          <div className="error-message">
            <FiAlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                className="auth-input"
                placeholder="corper@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FiMail className="input-icon" size={20} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FiLock className="input-icon" size={20} />
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Sign In'}
            {!loading && <FiArrowRight size={20} />}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
