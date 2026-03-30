import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import './Navbar.css';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          📋 Task Manager
        </Link>

        <div className="nav-menu">
          {isAuthenticated ? (
            <>
              <span className="user-info">Welcome, {user?.username}</span>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="nav-link logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
