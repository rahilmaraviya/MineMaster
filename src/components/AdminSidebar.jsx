import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/recipes', label: 'Recipes', icon: '📖' },
  { to: '/admin/recipe-editor', label: 'Add Recipe', icon: '➕' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/analytics', label: 'Analytics', icon: '📈' },
];

export default function AdminSidebar() {
  const { currentUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Admin logged out!');
    navigate('/admin/login');
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', top: 14, left: 14, zIndex: 1200,
          background: open ? 'var(--neon-green)' : 'rgba(5,5,8,0.9)',
          color: open ? '#000' : 'var(--neon-green)',
          border: '1px solid var(--neon-green)',
          borderRadius: 8, padding: '8px 12px', cursor: 'pointer',
          fontWeight: 700, display: 'none',
        }}
        className="admin-hamburger"
      >
        {open ? '✕' : '☰'}
      </button>

      <style>{`@media(max-width:768px){.admin-hamburger{display:flex!important;}}`}</style>

      <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
        <div className="admin-sidebar-logo">
          <NavLink to="/admin" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <span style={{ fontSize: '1.4rem' }}>⛏️</span>
            <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.6rem', color: 'var(--neon-green)', lineHeight: 1.6 }}>
              MineMaster<br />
              <span style={{ color: 'var(--gold)' }}>ADMIN</span>
            </span>
          </NavLink>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 10 }}>
            👤 {currentUser?.name || 'Admin'}
          </div>
          <NavLink to="/" style={{ display: 'block', marginBottom: 8 }}>
            <button className="btn btn-secondary btn-sm" style={{ width: '100%' }}>🌐 View Site</button>
          </NavLink>
          <button className="btn btn-danger btn-sm" style={{ width: '100%' }} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
        />
      )}
    </>
  );
}
