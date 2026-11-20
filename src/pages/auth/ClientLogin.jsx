import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';
import toast from 'react-hot-toast';

export default function ClientLogin() {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { login, register, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); clearError(); };

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login(form.email, form.password, 'client');
    if (res.success) { toast.success('Welcome back! ⛏️'); navigate('/'); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await register(form.name, form.email, form.password);
    if (res.success) { toast.success('Account created! Please login.'); setTab('login'); }
  };

  return (
    <div className="auth-layout">
      <div className="auth-bg-pattern" />
      <div className="glass-card auth-card animate-up">
        <div className="auth-logo">
          <div className="auth-icon">⛏️</div>
          <h1>MineMaster</h1>
          <p>The Ultimate Minecraft Recipe Tester</p>
        </div>

        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); clearError(); }}>Login</button>
          <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => { setTab('register'); clearError(); }}>Register</button>
        </div>

        {error && <div className="auth-error">⚠️ {error}</div>}

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input className="input" type="email" placeholder="steve@minemaster.com" value={form.email} onChange={e => set('email', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} required />
            </div>
            <button className="btn btn-primary" type="submit" style={{ width: '100%', marginTop: 4 }}>
              ⛏️ Enter the World
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Username</label>
              <input className="input" placeholder="Steve, Alex..." value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password <span style={{ color: 'var(--text-muted)' }}>(min 6 chars)</span></label>
              <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} required />
            </div>
            <button className="btn btn-primary" type="submit" style={{ width: '100%', marginTop: 4 }}>
              🎮 Create Account
            </button>
          </form>
        )}

        <div className="auth-footer">
          <span>Demo: </span>
          <strong style={{ color: 'var(--neon-green)' }}>steve@minemaster.com</strong>
          <span> / </span>
          <strong style={{ color: 'var(--neon-green)' }}>Steve@123</strong>
        </div>

        <div className="auth-footer" style={{ marginTop: 10 }}>
          Admin? <Link to="/admin/login" style={{ color: 'var(--gold)', fontWeight: 700, textDecoration: 'none' }}>Admin Portal →</Link>
        </div>
      </div>
    </div>
  );
}
