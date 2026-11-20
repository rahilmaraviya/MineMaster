import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore.js';

const TIERS = [
  { name: 'Novice', minXP: 0, nextXP: 200, icon: '🪵', color: '#8b7355' },
  { name: 'Apprentice', minXP: 200, nextXP: 600, icon: '⛏️', color: '#9ca3af' },
  { name: 'Journeyman', minXP: 600, nextXP: 1200, icon: '🔩', color: '#38bdf8' },
  { name: 'Expert', minXP: 1200, nextXP: 2500, icon: '💎', color: '#00d4ff' },
  { name: 'Master', minXP: 2500, nextXP: Infinity, icon: '👑', color: '#f0a30a' },
];

function getTier(xp) {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (xp >= TIERS[i].minXP) return TIERS[i];
  }
  return TIERS[0];
}

export default function Profile() {
  const { currentUser } = useAuthStore();
  if (!currentUser) return null;

  const xp = currentUser.xp || 0;
  const tier = getTier(xp);
  const nextTier = TIERS.find(t => t.minXP > tier.minXP);
  const progress = nextTier ? Math.min(((xp - tier.minXP) / (tier.nextXP - tier.minXP)) * 100, 100) : 100;
  const history = currentUser.quizHistory || [];
  const totalCorrect = history.reduce((a, h) => a + h.correct, 0);
  const totalWrong = history.reduce((a, h) => a + h.wrong, 0);
  const accuracy = (totalCorrect + totalWrong) > 0 ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100) : 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>👤 My <span className="text-green">Profile</span></h1>
      </div>

      <div className="profile-grid">
        {/* Left: Profile Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <motion.div
            className="glass-card profile-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="profile-avatar">{currentUser.name?.charAt(0)?.toUpperCase()}</div>
            <div className="profile-name">{currentUser.name}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{currentUser.email}</div>
            <div className="badge badge-green" style={{ marginTop: 4 }}>Player</div>
          </motion.div>

          {/* Tier */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div className="tier-badge">
              <div className="tier-icon">{tier.icon}</div>
              <div className="tier-name">{tier.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{xp} XP total</div>
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                <span>{tier.name}</span>
                <span>{nextTier ? nextTier.name : 'MAX'}</span>
              </div>
              <div style={{ height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 5, overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', borderRadius: 5, background: `linear-gradient(90deg, ${tier.color}, ${tier.color}99)`, boxShadow: `0 0 10px ${tier.color}80` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              {nextTier && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, textAlign: 'right' }}>
                  {tier.nextXP - xp} XP to {nextTier.name}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: 14 }}>📊 Stats</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Quizzes Played', value: history.length, color: 'var(--cyan)' },
                { label: 'Correct Answers', value: totalCorrect, color: 'var(--neon-green)' },
                { label: 'Wrong Answers', value: totalWrong, color: 'var(--crimson)' },
                { label: 'Accuracy', value: `${accuracy}%`, color: 'var(--gold)' },
                { label: 'Total XP', value: xp, color: 'var(--gold)' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
                  <span style={{ fontWeight: 800, color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: XP Timeline + History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Tier Roadmap */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 18, fontSize: '1rem' }}>🏆 Tier Roadmap</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {TIERS.map(t => {
                const unlocked = xp >= t.minXP;
                const isCurrent = tier.name === t.name;
                return (
                  <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, background: isCurrent ? `rgba(${t.color.replace('#','').match(/../g).map(h=>parseInt(h,16)).join(',')}, 0.1)` : 'var(--bg-glass)', border: `1px solid ${isCurrent ? t.color + '40' : 'rgba(255,255,255,0.05)'}`, opacity: unlocked ? 1 : 0.4 }}>
                    <span style={{ fontSize: '1.5rem' }}>{t.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: unlocked ? t.color : 'var(--text-muted)' }}>{t.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.minXP}+ XP</div>
                    </div>
                    {unlocked ? (
                      <span style={{ color: 'var(--neon-green)', fontWeight: 800, fontSize: '0.8rem' }}>✓ Unlocked</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>🔒 {t.minXP - xp} XP needed</span>
                    )}
                    {isCurrent && <span className="badge badge-gold">Current</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quiz History */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>📋 Quiz History</h3>
            {history.length === 0 ? (
              <div className="empty-state" style={{ padding: '30px 0' }}>
                <div className="empty-icon">🎯</div>
                <p>No quizzes yet — go play!</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Difficulty</th>
                      <th>Result</th>
                      <th>XP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h, i) => (
                      <tr key={i}>
                        <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          {new Date(h.date).toLocaleDateString()}
                        </td>
                        <td style={{ textTransform: 'capitalize' }}>{h.difficulty}</td>
                        <td>
                          <span style={{ color: 'var(--neon-green)' }}>{h.correct}✓</span>
                          {' '}/{' '}
                          <span style={{ color: 'var(--crimson)' }}>{h.wrong}✗</span>
                        </td>
                        <td style={{ color: 'var(--gold)', fontWeight: 700 }}>+{h.xpEarned}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
