import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import useRecipeStore from '../../store/recipeStore.js';
import useAuthStore from '../../store/authStore.js';

const COLORS = ['#39ff14', '#f0a30a', '#00d4ff', '#8b5cf6', '#e63946', '#06b6d4', '#84cc16', '#ec4899'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#0d0d14', border: '1px solid rgba(57,255,20,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: '0.85rem' }}>
        <div style={{ fontWeight: 700 }}>{label || payload[0].name}</div>
        <div style={{ color: 'var(--neon-green)' }}>{payload[0].value} {payload[0].unit || ''}</div>
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const getStats = useRecipeStore(s => s.getStats);
  const getAllUsers = useAuthStore(s => s.getAllUsers);
  const stats = getStats();
  const users = getAllUsers();

  const categoryData = Object.entries(stats.byCategory || {})
    .map(([name, count]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), count }))
    .sort((a, b) => b.count - a.count);

  const pieData = categoryData.map(d => ({ name: d.name, value: d.count }));

  const userTierData = [
    { name: 'Novice', count: users.filter(u => (u.xp||0) < 200).length },
    { name: 'Apprentice', count: users.filter(u => (u.xp||0) >= 200 && (u.xp||0) < 600).length },
    { name: 'Journeyman', count: users.filter(u => (u.xp||0) >= 600 && (u.xp||0) < 1200).length },
    { name: 'Expert', count: users.filter(u => (u.xp||0) >= 1200 && (u.xp||0) < 2500).length },
    { name: 'Master', count: users.filter(u => (u.xp||0) >= 2500).length },
  ].filter(d => d.count > 0);

  const totalQuizzes = users.reduce((a, u) => a + (u.quizHistory?.length || 0), 0);
  const totalXPGiven = users.reduce((a, u) => a + (u.xp || 0), 0);
  const avgAccuracy = (() => {
    const all = users.flatMap(u => u.quizHistory || []);
    if (!all.length) return 0;
    const correct = all.reduce((a, h) => a + h.correct, 0);
    const total = all.reduce((a, h) => a + h.correct + h.wrong, 0);
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  })();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📈 <span className="text-gold">Analytics</span></h1>
        <p>Platform statistics and insights</p>
      </div>

      {/* KPI Row */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        {[
          { icon: '📖', label: 'Total Recipes', value: stats.total, color: 'var(--neon-green)' },
          { icon: '🎯', label: 'Quizzes Played', value: totalQuizzes, color: 'var(--cyan)' },
          { icon: '⭐', label: 'Total XP Given', value: totalXPGiven, color: 'var(--gold)' },
          { icon: '🎯', label: 'Avg Accuracy', value: `${avgAccuracy}%`, color: 'var(--purple)' },
        ].map(k => (
          <div key={k.label} className="stat-card" style={{ borderColor: `${k.color}22` }}>
            <div className="stat-icon">{k.icon}</div>
            <div className="stat-value" style={{ color: k.color }}>{k.value}</div>
            <div className="stat-label">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Bar Chart: Recipes per Category */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 20, fontSize: '1rem' }}>📂 Recipes by Category</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={categoryData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: '#606070', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#606070', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(57,255,20,0.06)' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart: Category Distribution */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 20, fontSize: '1rem' }}>🥧 Category Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} formatter={(val) => <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{val}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Tier Distribution */}
      {userTierData.length > 0 && (
        <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ marginBottom: 20, fontSize: '1rem' }}>🏆 User Tier Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={userTierData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: '#606070', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#606070', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(240,163,10,0.05)' }} />
              <Bar dataKey="count" fill="var(--gold)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Users Table Summary */}
      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>👥 Top Users by XP</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>XP</th>
                <th>Quizzes</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {[...users].sort((a,b) => (b.xp||0)-(a.xp||0)).slice(0,8).map((u, i) => (
                <tr key={u.id}>
                  <td style={{ color: i === 0 ? 'var(--gold)' : i === 1 ? 'var(--stone-light)' : i === 2 ? '#cd7f32' : 'var(--text-muted)', fontWeight: 800 }}>#{i+1}</td>
                  <td style={{ fontWeight: 700 }}>{u.name}</td>
                  <td style={{ color: 'var(--gold)', fontWeight: 800 }}>{u.xp || 0}</td>
                  <td>{u.quizHistory?.length || 0}</td>
                  <td><span className={`badge ${u.role === 'admin' ? 'badge-gold' : 'badge-green'}`}>{u.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
