import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiUser,
  FiArrowRight,
  FiAlertCircle,
} from "react-icons/fi";
import { supabase } from "../lib/supabase";
import "./Auth.css";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      navigate("/");
    } else {
      alert("Please check your email for the confirmation link!");
      navigate("/login");
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-blob auth-blob-1"></div>
      <div className="auth-blob auth-blob-2"></div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">NCCF</div>
          <h2>Join the Fellowship</h2>
          <p>Create your portal account today</p>
        </div>

        {error && (
          <div className="error-message">
            <FiAlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSignUp}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="fullName"
                className="auth-input"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <FiUser className="input-icon" size={20} />
            </div>
          </div>

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
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FiLock className="input-icon" size={20} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="confirmPassword"
                className="auth-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <FiLock className="input-icon" size={20} />
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
            {!loading && <FiArrowRight size={20} />}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
