import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { AuthContext } from "../hook/AuthContext";

const Navbar: React.FC = () => {
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "dashboard" },
    { path: "/rooms", label: "Rooms", icon: "rooms" },
    { path: "/verify-payment", label: "Verify Payment", icon: "payment" },
    { path: "/admin", label: "Admin", icon: "admin" },
    { path: "/profile", label: "Profile", icon: "profile" },
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "dashboard":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.5 7.5L10 2.5L17.5 7.5V16.6667C17.5 17.1087 17.3244 17.5326 17.0118 17.8452C16.6993 18.1577 16.2754 18.3333 15.8333 18.3333H4.16667C3.72464 18.3333 3.30072 18.1577 2.98816 17.8452C2.67559 17.5326 2.5 17.1087 2.5 16.6667V7.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.5 18.3333V10H12.5V18.3333"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "rooms":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.33333 5.83333C3.33333 5.39131 3.50893 4.96738 3.82149 4.65482C4.13405 4.34226 4.55797 4.16667 5 4.16667H15C15.442 4.16667 15.866 4.34226 16.1785 4.65482C16.4911 4.96738 16.6667 5.39131 16.6667 5.83333V14.1667C16.6667 14.6087 16.4911 15.0326 16.1785 15.3452C15.866 15.6577 15.442 15.8333 15 15.8333H5C4.55797 15.8333 4.13405 15.6577 3.82149 15.3452C3.50893 15.0326 3.33333 14.6087 3.33333 14.1667V5.83333Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.33333 8.33333H16.6667"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "payment":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.5 4.16667H2.5C1.5795 4.16667 0.833333 4.91283 0.833333 5.83333V14.1667C0.833333 15.0872 1.5795 15.8333 2.5 15.8333H17.5C18.4205 15.8333 19.1667 15.0872 19.1667 14.1667V5.83333C19.1667 4.91283 18.4205 4.16667 17.5 4.16667Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M0.833333 8.33333H19.1667"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.16667 12.5H5.83333"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "admin":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 11.6667C12.7614 11.6667 15 9.42809 15 6.66667C15 3.90524 12.7614 1.66667 10 1.66667C7.23858 1.66667 5 3.90524 5 6.66667C5 9.42809 7.23858 11.6667 10 11.6667Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.6667 18.3333C16.6667 16.1242 13.682 14.3333 10 14.3333C6.3181 14.3333 3.33333 16.1242 3.33333 18.3333"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15 13.3333L18.3333 16.6667"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18.3333 13.3333L15 16.6667"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "profile":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.6667 17.5V15.8333C16.6667 14.9493 16.3155 14.1014 15.6904 13.4763C15.0652 12.8512 14.2174 12.5 13.3333 12.5H6.66667C5.78261 12.5 4.93477 12.8512 4.30964 13.4763C3.68452 14.1014 3.33333 14.9493 3.33333 15.8333V17.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 9.16667C11.8409 9.16667 13.3333 7.67428 13.3333 5.83333C13.3333 3.99238 11.8409 2.5 10 2.5C8.15905 2.5 6.66667 3.99238 6.66667 5.83333C6.66667 7.67428 8.15905 9.16667 10 9.16667Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );

      default:
        return null;
    }
  };
  const auth = useContext(AuthContext);
  const user = auth?.user;
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async (userId: string) => {
      if (!userId) {
        setUserRole(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("admins")
          .select("role")
          .eq("id", userId)
          .maybeSingle();
        if (error) {
          setUserRole("user");
          return;
        }

        setUserRole(data?.role || "user");
      } catch (err) {
        console.error("Error fetching user role:", err);
        setUserRole("user");
      }
    };

    const runFetch = async () => {
      await fetchUserRole(user?.id!);
    };
    runFetch();
  }, [user?.id]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <ul className="nav-list">
          {navItems.map((item) => {
            const isVisible =
              item.path === "/admin" ? userRole === "admin" : true;

            if (!isVisible) return null;

            return (
              <li key={item.path} className="nav-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                  end={item.path === "/"}
                >
                  <span className="nav-icon">{getIcon(item.icon)}</span>
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
