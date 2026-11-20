import { useState } from 'react';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore.js';
import toast from 'react-hot-toast';

export default function UserManager() {
  const { getAllUsers, toggleUserActive, changeUserRole, deleteUser } = useAuthStore();
  const [query, setQuery] = useState('');
  const [toDelete, setToDelete] = useState(null);

  const users = getAllUsers();
  const filtered = users.filter(u =>
    !query || u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase())
  );

  const handleToggle = (id) => {
    toggleUserActive(id);
    toast.success('User status updated!');
  };

  const handleRole = (id, role) => {
    changeUserRole(id, role);
    toast.success('Role changed!');
  };

  const handleDelete = (id) => {
    deleteUser(id);
    toast.success('User removed!');
    setToDelete(null);
  };

  const getXPTier = (xp = 0) => {
    if (xp >= 2500) return { name: 'Master', icon: '👑' };
    if (xp >= 1200) return { name: 'Expert', icon: '💎' };
    if (xp >= 600) return { name: 'Journeyman', icon: '🔩' };
    if (xp >= 200) return { name: 'Apprentice', icon: '⛏️' };
    return { name: 'Novice', icon: '🪵' };
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>👥 User <span className="text-gold">Manager</span></h1>
        <p>{users.length} total users — {users.filter(u => u.active).length} active</p>
      </div>

      {/* Stats Row */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Users', value: users.length, color: 'var(--cyan)' },
          { label: 'Active', value: users.filter(u => u.active).length, color: 'var(--neon-green)' },
          { label: 'Inactive', value: users.filter(u => !u.active).length, color: 'var(--crimson)' },
          { label: 'Admins', value: users.filter(u => u.role === 'admin').length, color: 'var(--gold)' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input className="input" placeholder="Search by name or email..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Tier / XP</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No users found</td>
              </tr>
            ) : filtered.map((u, i) => {
              const tier = getXPTier(u.xp);
              return (
                <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--neon-green-dim)', border: '1.5px solid var(--neon-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', color: 'var(--neon-green)', flexShrink: 0 }}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 700 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td>
                    <select
                      className="select"
                      value={u.role}
                      style={{ width: 'auto', padding: '4px 8px', fontSize: '0.8rem' }}
                      onChange={e => handleRole(u.id, e.target.value)}
                    >
                      <option value="client">Client</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.82rem' }}>
                      <span>{tier.icon} {tier.name}</span>
                      <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.75rem' }}>{u.xp || 0} XP</div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${u.active ? 'badge-green' : 'badge-red'}`}>
                      {u.active ? '● Active' : '○ Inactive'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button className="btn btn-sm btn-secondary" onClick={() => handleToggle(u.id)}>
                        {u.active ? '🔒' : '🔓'}
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => setToDelete(u)}>🗑️</button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {toDelete && (
        <div className="modal-overlay" onClick={() => setToDelete(null)}>
          <div className="glass-card" style={{ padding: 32, maxWidth: 380, width: '100%', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>👤</div>
            <h3 style={{ marginBottom: 8 }}>Remove User?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Remove <strong>{toDelete.name}</strong> permanently?</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="btn btn-danger" onClick={() => handleDelete(toDelete.id)}>🗑️ Remove</button>
              <button className="btn btn-secondary" onClick={() => setToDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
