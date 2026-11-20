import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore.js';
import useRecipeStore from '../../store/recipeStore.js';

const TIERS = [
  { name: 'Novice', minXP: 0, icon: '🪵' },
  { name: 'Apprentice', minXP: 200, icon: '⛏️' },
  { name: 'Journeyman', minXP: 600, icon: '🔩' },
  { name: 'Expert', minXP: 1200, icon: '💎' },
  { name: 'Master', minXP: 2500, icon: '👑' },
];

function getTier(xp) {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (xp >= TIERS[i].minXP) return TIERS[i];
  }
  return TIERS[0];
}

const FEATURES = [
  { icon: '📖', title: 'Browse Recipes', desc: 'Explore 77+ real Minecraft 1.21 recipes across all categories.', action: '/browse' },
  { icon: '⚒️', title: 'Crafting Lab', desc: 'Use the interactive 3×3 grid to test recipes in real time.', action: '/lab' },
  { icon: '🎯', title: 'Quiz Challenge', desc: 'Test your knowledge with timed quizzes and earn XP.', action: '/quiz' },
];

export default function Home() {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const getStats = useRecipeStore(s => s.getStats);
  const stats = getStats();
  const tier = getTier(currentUser?.xp || 0);

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <span className="hero-floating">⛏️</span>
        <span className="hero-floating">💎</span>
        <span className="hero-floating">🪵</span>
        <span className="hero-floating">⚔️</span>
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="hero-tag">⭐ Minecraft 1.21 Recipes</div>
          <h1>
            Master Every<br />
            <span className="highlight">Minecraft Recipe</span>
          </h1>
          <p>
            Browse, test, and quiz yourself on {stats.total}+ Minecraft crafting recipes.
            Use our live 3×3 crafting grid and earn XP as you learn.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/lab')}>
              ⚒️ Open Crafting Lab
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/browse')}>
              📖 Browse Recipes
            </button>
          </div>
          {currentUser && (
            <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <span>{tier.icon}</span>
              Welcome back, <strong style={{ color: 'var(--neon-green)' }}>{currentUser.name}</strong>!
              You're a <strong style={{ color: 'var(--gold)' }}>{tier.name}</strong> with <strong style={{ color: 'var(--neon-green)' }}>{currentUser.xp} XP</strong>.
            </div>
          )}
        </motion.div>
      </section>

      {/* STATS STRIP */}
      <div className="stats-strip">
        <div className="stats-strip-inner">
          <div className="strip-stat">
            <span className="num">{stats.total}+</span>
            <span className="lbl">Total Recipes</span>
          </div>
          <div className="strip-stat">
            <span className="num">8</span>
            <span className="lbl">Categories</span>
          </div>
          <div className="strip-stat">
            <span className="num">5</span>
            <span className="lbl">XP Tiers</span>
          </div>
          <div className="strip-stat">
            <span className="num">3</span>
            <span className="lbl">Quiz Modes</span>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="features-section">
        <div className="section-header">
          <h2>Everything You Need to <span className="text-green">Master</span> Crafting</h2>
          <p>Three powerful tools to help you remember every Minecraft recipe.</p>
        </div>
        <div className="grid-3" style={{ maxWidth: 900, margin: '0 auto' }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="glass-card feature-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(f.action)}
            >
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <span style={{ color: 'var(--neon-green)', fontWeight: 700, fontSize: '0.85rem' }}>Explore →</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* XP TIERS */}
      <section style={{ padding: '60px 24px', maxWidth: 900, margin: '0 auto' }}>
        <div className="section-header">
          <h2>XP <span className="text-gold">Tier</span> System</h2>
          <p>Earn XP by completing quizzes and level up your Minecraft expertise.</p>
        </div>
        <div className="grid-auto" style={{ maxWidth: 800, margin: '0 auto' }}>
          {TIERS.map(t => (
            <div
              key={t.name}
              className="glass-card"
              style={{
                padding: '20px',
                textAlign: 'center',
                borderColor: tier.name === t.name ? 'var(--gold)' : undefined,
                background: tier.name === t.name ? 'rgba(240,163,10,0.06)' : undefined,
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>{t.icon}</div>
              <div style={{ fontWeight: 800, marginBottom: 4 }}>{t.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.minXP}+ XP</div>
              {tier.name === t.name && (
                <div className="badge badge-gold" style={{ marginTop: 8 }}>Current</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
