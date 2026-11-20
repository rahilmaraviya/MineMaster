import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { currentUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out!');
    navigate('/login');
  };

  const initials = currentUser?.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-logo">
        <span className="logo-icon">⛏️</span>
        <span className="logo-text">MineMaster</span>
      </NavLink>

      <div className={`navbar-links ${open ? 'open' : ''}`}>
        <NavLink to="/" end onClick={() => setOpen(false)}>🏠 Home</NavLink>
        <NavLink to="/browse" onClick={() => setOpen(false)}>📖 Recipes</NavLink>
        <NavLink to="/lab" onClick={() => setOpen(false)}>⚒️ Lab</NavLink>
        <NavLink to="/quiz" onClick={() => setOpen(false)}>🎯 Quiz</NavLink>
        <NavLink to="/profile" onClick={() => setOpen(false)}>👤 Profile</NavLink>
      </div>

      <div className="navbar-right">
        <div className="user-badge">
          <div className="avatar">{initials}</div>
          <span style={{ display: window.innerWidth < 600 ? 'none' : 'block' }}>{currentUser?.name}</span>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
        <button className="hamburger" onClick={() => setOpen(!open)}>
          {open ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
}
