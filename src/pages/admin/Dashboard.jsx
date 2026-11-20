import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useRecipeStore from '../../store/recipeStore.js';
import useAuthStore from '../../store/authStore.js';

const ACTIVITY = [
  { type: 'green', text: 'New recipe added: Diamond Sword', time: '2 min ago' },
  { type: 'cyan', text: 'User "Alex" completed Hard quiz', time: '15 min ago' },
  { type: 'gold', text: 'Recipe "Beacon" was edited', time: '1 hour ago' },
  { type: 'red', text: 'Recipe "Test" deleted', time: '3 hours ago' },
  { type: 'green', text: 'New user "Notch" registered', time: '5 hours ago' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const getStats = useRecipeStore(s => s.getStats);
  const getAllUsers = useAuthStore(s => s.getAllUsers);
  const stats = getStats();
  const users = getAllUsers();
  const clientCount = users.filter(u => u.role === 'client').length;

  const STAT_CARDS = [
    { label: 'Total Recipes', value: stats.total, icon: '📖', color: 'var(--neon-green)', action: () => navigate('/admin/recipes') },
    { label: 'Custom Recipes', value: stats.custom, icon: '✏️', color: 'var(--gold)', action: () => navigate('/admin/recipes') },
    { label: 'Registered Users', value: users.length, icon: '👥', color: 'var(--cyan)', action: () => navigate('/admin/users') },
    { label: 'Active Players', value: clientCount, icon: '🎮', color: 'var(--purple)', action: () => navigate('/admin/users') },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📊 Admin <span className="text-gold">Dashboard</span></h1>
        <p>Welcome to the MineMaster control panel</p>
      </div>

      {/* Stat Cards */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        {STAT_CARDS.map((s, i) => (
          <motion.div
            key={s.label}
            className="stat-card"
            style={{ cursor: 'pointer', borderColor: `${s.color}22` }}
            onClick={s.action}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid-2">
        {/* Category Breakdown */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>📂 Recipes by Category</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(stats.byCategory || {}).sort((a,b) => b[1]-a[1]).map(([cat, count]) => (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 80, fontSize: '0.82rem', color: 'var(--text-secondary)', textTransform: 'capitalize', flexShrink: 0 }}>{cat}</span>
                <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(count / stats.total) * 100}%`, background: 'var(--neon-green)', borderRadius: 4, boxShadow: '0 0 8px rgba(57,255,20,0.4)' }} />
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--neon-green)', width: 24, textAlign: 'right' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>🕒 Recent Activity</h3>
          <div className="activity-list">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="activity-item">
                <div className={`activity-dot ${a.type}`} />
                <div className="activity-info">
                  <div className="activity-text">{a.text}</div>
                  <div className="activity-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 14, fontSize: '1rem' }}>⚡ Quick Actions</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/admin/recipe-editor')}>➕ Add Recipe</button>
          <button className="btn btn-secondary" onClick={() => navigate('/admin/recipes')}>📖 Manage Recipes</button>
          <button className="btn btn-secondary" onClick={() => navigate('/admin/users')}>👥 Manage Users</button>
          <button className="btn btn-secondary" onClick={() => navigate('/admin/analytics')}>📈 View Analytics</button>
        </div>
      </div>
    </div>
  );
}
