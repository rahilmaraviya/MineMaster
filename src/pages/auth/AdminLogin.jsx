import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); clearError(); };

  const handleLogin = (e) => {
    e.preventDefault();
    const res = login(form.email, form.password, 'admin');
    if (res.success) { toast.success('Admin access granted! 🛠️'); navigate('/admin'); }
  };

  return (
    <div className="auth-layout">
      <div className="auth-bg-pattern" />
      <div className="glass-card auth-card animate-up" style={{ borderColor: 'rgba(240,163,10,0.3)' }}>
        <div className="auth-logo">
          <div className="auth-icon">🛠️</div>
          <h1 style={{ color: 'var(--gold)', textShadow: 'var(--gold-glow)' }}>Admin Portal</h1>
          <p>MineMaster Administration System</p>
        </div>

        {error && <div className="auth-error">⚠️ {error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Admin Email</label>
            <input className="input" type="email" placeholder="admin@minemaster.com" value={form.email} onChange={e => set('email', e.target.value)} required style={{ borderColor: 'rgba(240,163,10,0.2)' }} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} required style={{ borderColor: 'rgba(240,163,10,0.2)' }} />
          </div>
          <button className="btn btn-gold" type="submit" style={{ width: '100%', marginTop: 4 }}>
            🛠️ Access Control Panel
          </button>
        </form>

        <div className="auth-footer">
          <span>Demo: </span>
          <strong style={{ color: 'var(--gold)' }}>admin@minemaster.com</strong>
          <span> / </span>
          <strong style={{ color: 'var(--gold)' }}>Admin@123</strong>
        </div>

        <div className="auth-footer" style={{ marginTop: 10 }}>
          Player? <Link to="/login" style={{ color: 'var(--neon-green)', fontWeight: 700, textDecoration: 'none' }}>Player Login →</Link>
        </div>
      </div>
    </div>
  );
}
