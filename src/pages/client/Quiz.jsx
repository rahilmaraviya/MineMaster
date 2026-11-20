import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useRecipeStore from '../../store/recipeStore.js';
import useAuthStore from '../../store/authStore.js';
import { ITEMS } from '../../data/recipes.js';
import ItemIcon from '../../components/ItemIcon.jsx';
import toast from 'react-hot-toast';

const DIFFICULTIES = [
  { key: 'easy', label: '🟢 Easy', time: 30, xp: 10, desc: 'Multiple choice — pick the output' },
  { key: 'medium', label: '🟡 Medium', time: 20, xp: 20, desc: 'Pick the main ingredient' },
  { key: 'hard', label: '🔴 Hard', time: 15, xp: 40, desc: 'No hints — recall all ingredients' },
];

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function generateQuestion(recipes, diff) {
  const recipe = recipes[Math.floor(Math.random() * recipes.length)];
  const outputItem = ITEMS[recipe.output];
  const allOutputs = Object.values(ITEMS);

  if (diff === 'easy') {
    // MCQ: what does this recipe produce?
    const correct = outputItem;
    const wrongs = shuffle(allOutputs.filter(i => i.id !== recipe.output)).slice(0, 3);
    return {
      type: 'easy',
      question: `What does this recipe craft?`,
      grid: recipe.grid,
      options: shuffle([correct, ...wrongs]),
      answer: correct.id,
      recipe,
    };
  }

  if (diff === 'medium') {
    // Pick the key ingredient
    const ingredients = recipe.grid.filter(Boolean);
    const mainId = ingredients[0];
    const mainItem = ITEMS[mainId];
    const wrongs = shuffle(Object.values(ITEMS).filter(i => !ingredients.includes(i.id))).slice(0, 3);
    return {
      type: 'medium',
      question: `Which item is used to craft ${recipe.name}?`,
      recipe,
      options: shuffle([mainItem, ...wrongs]),
      answer: mainId,
    };
  }

  // Hard: given the output, guess what you craft
  const decoys = shuffle(recipes.filter(r => r.id !== recipe.id)).slice(0, 3);
  return {
    type: 'hard',
    question: `Which recipe produces ${recipe.name}?`,
    options: shuffle([recipe, ...decoys]).map(r => ({
      id: r.id,
      name: r.name,
      emoji: ITEMS[r.output]?.emoji,
    })),
    answer: recipe.id,
    recipe,
  };
}

export default function Quiz() {
  const getAll = useRecipeStore(s => s.getAll);
  const { addXP, addQuizHistory, currentUser } = useAuthStore();
  const recipes = getAll();

  const [diff, setDiff] = useState(null);
  const [phase, setPhase] = useState('select'); // select | playing | result
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState({ correct: 0, wrong: 0, streak: 0 });
  const [totalXP, setTotalXP] = useState(0);

  const diffConfig = DIFFICULTIES.find(d => d.key === diff);

  const newQuestion = useCallback(() => {
    setQuestion(generateQuestion(recipes, diff));
    setSelected(null);
    setTimeLeft(diffConfig?.time || 30);
  }, [recipes, diff, diffConfig]);

  // Timer
  useEffect(() => {
    if (phase !== 'playing' || selected !== null) return;
    if (timeLeft <= 0) {
      setSelected('__timeout__');
      setScore(s => ({ ...s, wrong: s.wrong + 1, streak: 0 }));
      return;
    }
    const t = setTimeout(() => setTimeLeft(l => l - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase, selected]);

  const startQuiz = (d) => {
    setDiff(d);
    setScore({ correct: 0, wrong: 0, streak: 0 });
    setTotalXP(0);
    setPhase('playing');
  };

  const handleAnswer = (optId) => {
    if (selected !== null) return;
    setSelected(optId);
    const isCorrect = optId === question.answer;
    if (isCorrect) {
      const earned = diffConfig.xp + score.streak * 2;
      setScore(s => ({ ...s, correct: s.correct + 1, streak: s.streak + 1 }));
      setTotalXP(x => x + earned);
      toast.success(`+${earned} XP! ${score.streak > 0 ? '🔥 Streak x' + (score.streak + 1) : ''}`, { duration: 1500 });
    } else {
      setScore(s => ({ ...s, wrong: s.wrong + 1, streak: 0 }));
      toast.error('Wrong!', { duration: 1200 });
    }
  };

  const next = () => newQuestion();

  const finish = () => {
    addXP(totalXP);
    addQuizHistory({
      date: new Date().toISOString(),
      difficulty: diff,
      correct: score.correct,
      wrong: score.wrong,
      xpEarned: totalXP,
    });
    setPhase('result');
  };

  useEffect(() => {
    if (phase === 'playing') newQuestion();
  }, [phase]);

  const timerPct = ((timeLeft / (diffConfig?.time || 30)) * 100).toFixed(1);
  const timerCls = timerPct > 60 ? 'safe' : timerPct > 30 ? 'warn' : 'danger';

  if (phase === 'select') {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h1>🎯 Quiz <span className="text-green">Challenge</span></h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 6 }}>
            Test your Minecraft recipe knowledge and earn XP!
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {DIFFICULTIES.map(d => (
            <button
              key={d.key}
              className="glass-card"
              style={{ padding: '22px 24px', border: '1px solid var(--border)', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 18, transition: 'var(--transition)', background: 'var(--bg-card)' }}
              onClick={() => startQuiz(d.key)}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(57,255,20,0.5)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ fontSize: '2.5rem' }}>{d.label.split(' ')[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{d.label.split(' ').slice(1).join(' ')}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 3 }}>{d.desc}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--neon-green)', fontWeight: 800 }}>+{d.xp} XP</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.time}s per Q</div>
              </div>
            </button>
          ))}
        </div>
        {currentUser?.quizHistory?.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <h3 style={{ marginBottom: 12, fontSize: '0.95rem' }}>📋 Recent Results</h3>
            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--neon-green)', borderBottom: '1px solid var(--border)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Difficulty</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--neon-green)', borderBottom: '1px solid var(--border)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Score</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--neon-green)', borderBottom: '1px solid var(--border)', fontSize: '0.75rem', textTransform: 'uppercase' }}>XP</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUser.quizHistory.slice(0, 5).map((h, i) => (
                    <tr key={i}>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', textTransform: 'capitalize' }}>{h.difficulty}</td>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ color: 'var(--neon-green)' }}>{h.correct}✓</span> / <span style={{ color: 'var(--crimson)' }}>{h.wrong}✗</span>
                      </td>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--gold)', fontWeight: 700 }}>+{h.xpEarned}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (phase === 'result') {
    const total = score.correct + score.wrong;
    const pct = total > 0 ? Math.round((score.correct / total) * 100) : 0;
    return (
      <div className="quiz-container">
        <motion.div className="glass-card quiz-result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div style={{ fontSize: '4rem', marginBottom: 8 }}>{pct >= 70 ? '🎉' : pct >= 40 ? '🙂' : '😅'}</div>
          <div className="result-score">{pct}%</div>
          <div className="result-label">{score.correct} correct, {score.wrong} wrong</div>
          <div style={{ marginTop: 20, marginBottom: 28, padding: '16px', background: 'rgba(57,255,20,0.08)', borderRadius: 8, border: '1px solid rgba(57,255,20,0.2)' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--gold)' }}>+{totalXP} XP</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Added to your profile</div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => { setPhase('select'); }}>Play Again</button>
            <button className="btn btn-secondary" onClick={() => window.location.href = '/profile'}>View Profile</button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!question) return <div className="page-container" style={{ textAlign: 'center', paddingTop: 60 }}>Loading...</div>;

  return (
    <div className="quiz-container">
      {/* Score Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: '0.85rem' }}>
        <span style={{ color: 'var(--neon-green)' }}>✓ {score.correct}</span>
        <span style={{ color: 'var(--gold)', fontWeight: 700 }}>🔥 Streak {score.streak}</span>
        <span style={{ color: 'var(--crimson)' }}>✗ {score.wrong}</span>
      </div>

      <div className="glass-card quiz-card">
        {/* Timer */}
        <div className="quiz-timer">
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: timerCls === 'danger' ? 'var(--crimson)' : 'var(--text-secondary)', minWidth: 28 }}>{timeLeft}s</span>
          <div className="timer-bar-track">
            <div className={`timer-bar-fill ${timerCls}`} style={{ width: `${timerPct}%` }} />
          </div>
          <span className="badge badge-stone" style={{ textTransform: 'capitalize' }}>{diff}</span>
        </div>

        {/* Grid preview for easy */}
        {question.grid && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 44px)', gridTemplateRows: 'repeat(3, 44px)', gap: 3 }}>
              {question.grid.map((cell, i) => {
                const item = cell ? ITEMS[cell] : null;
                return (
                  <div key={i} style={{ width: 44, height: 44, background: item ? 'rgba(57,255,20,0.08)' : 'rgba(20,20,30,0.8)', border: `1.5px solid ${item ? 'rgba(57,255,20,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }} title={item?.name}>
                    {item ? <ItemIcon itemId={cell} size={28} /> : ''}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="quiz-question">
          <span className="q-label">Question</span>
          <div className="q-text">{question.question}</div>
        </div>

        <div className={question.type === 'hard' ? '' : 'quiz-options'}>
          {question.options.map(opt => {
            const optId = opt.id;
            const isCorrect = optId === question.answer;
            const isSelected = selected === optId;
            let cls = 'quiz-option';
            if (selected !== null) {
              if (isCorrect) cls += ' correct';
              else if (isSelected) cls += ' wrong';
            }
            return (
              <button
                key={optId}
                className={cls}
                disabled={selected !== null}
                onClick={() => handleAnswer(optId)}
                style={{ marginBottom: question.type === 'hard' ? 8 : 0, width: question.type === 'hard' ? '100%' : undefined }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 40, width: 40, flexShrink: 0 }}>
                  <ItemIcon itemId={opt.id} size={32} />
                </div>
                <span>{opt.name || ITEMS[opt.id]?.name}</span>
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <motion.div
            style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'center' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <button className="btn btn-primary" onClick={next}>Next Question →</button>
            <button className="btn btn-secondary" onClick={finish}>Finish & See Score</button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
