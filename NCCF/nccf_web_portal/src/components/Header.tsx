import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import { useTheme } from "../hook/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

interface Profile {
  name: string;
  username: string | null;
  bio: string | null;
  avatar: string | null;
  gender: string | null;
  batch: string | null;
  state_code: string | null;
  location: string | null;
}

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { theme, toggleTheme } = useTheme();

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
    } else {
      setProfile(data);
    }
  }, []);

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (!currentUser) {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <Link to="/" className="logo">
            <div className="logo-icon">
              <img src="/logo.svg" alt="NCCF Logo" width="32" height="32" />
            </div>
            <span className="logo-text">NCCF</span>
          </Link>

          <div className="header-actions">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <FiSun /> : <FiMoon />}
            </button>

            {user ? (
              <>
                <button className="notification-btn">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 6.66667C15 5.34058 14.4732 4.06881 13.5355 3.13113C12.5979 2.19345 11.3261 1.66667 10 1.66667C8.67392 1.66667 7.40215 2.19345 6.46447 3.13113C5.52678 4.06881 5 5.34058 5 6.66667C5 12.5 2.5 14.1667 2.5 14.1667H17.5C17.5 14.1667 15 12.5 15 6.66667Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.4417 17.5C11.2952 17.7526 11.0849 17.9622 10.8319 18.1079C10.5789 18.2537 10.292 18.3304 10 18.3304C9.70802 18.3304 9.42115 18.2537 9.16814 18.1079C8.91513 17.9622 8.70484 17.7526 8.55835 17.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="notification-badge">3</span>
                </button>

                <Link to="/profile" className="profile-btn">
                  <div className="profile-avatar">
                    {profile?.avatar ? (
                      <img src={profile.avatar} alt="Profile" />
                    ) : (
                      <span>{user.email?.[0].toUpperCase()}</span>
                    )}
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-secondary"
                  style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}
                >
                  Logout
                </button>
              </>
            ) : (
              <div style={{ display: "flex", gap: "1rem" }}>
                <Link
                  to="/login"
                  className="btn-secondary"
                  style={{ textDecoration: "none" }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary"
                  style={{ textDecoration: "none" }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
