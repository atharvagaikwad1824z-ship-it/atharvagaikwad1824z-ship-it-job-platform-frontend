import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          JobPlatform
        </Link>

        <div className="navbar-links">
          <Link to="/jobs">Jobs</Link>

          {user && <Link to="/messages">Messages</Link>}

          {user?.role === "employer" && <Link to="/post-job">Post Job</Link>}

          {user && <Link to="/dashboard">Dashboard</Link>}

          {user?.role === "admin" && (
  <Link to="/dashboard/admin">Admin Panel</Link>
)}
        </div>
      </div>

      <div className="navbar-right">
        {!user ? (
          <div className="navbar-auth">
            <Link to="/login">Login</Link>
            <Link to="/register" className="register-btn">
              Register
            </Link>
          </div>
        ) : (
          <div className="navbar-user" ref={dropdownRef} onClick={() => setDropdownOpen(!dropdownOpen)}>
            <span className="navbar-username">Hi, {user.name}</span>

            <img
              src={
                user.profilePic ||
                user.companyLogo ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt="User"
              className="navbar-avatar"
            />

            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link
                  to="/profile"
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  👤 Profile
                </Link>

                <button className="dropdown-item logout-btn" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
