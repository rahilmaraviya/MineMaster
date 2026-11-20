import { useState } from 'react';
import { motion } from 'framer-motion';
import CraftingGrid from '../../components/CraftingGrid.jsx';
import useRecipeStore from '../../store/recipeStore.js';
import { ITEMS } from '../../data/recipes.js';
import ItemIcon from '../../components/ItemIcon.jsx';
import toast from 'react-hot-toast';

const EMPTY = Array(9).fill('');

export default function CraftingLab() {
  const [grid, setGrid] = useState(EMPTY);
  const matchGrid = useRecipeStore(s => s.matchGrid);
  const result = matchGrid(grid);

  const copyRecipe = () => {
    const items = grid.map(g => ITEMS[g]?.name || 'empty');
    const text = `Crafting Recipe:\n${items.slice(0,3).join(' | ')}\n${items.slice(3,6).join(' | ')}\n${items.slice(6,9).join(' | ')}\n→ ${result?.name || 'No result'}`;
    navigator.clipboard.writeText(text).then(() => toast.success('Recipe copied to clipboard!'));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>⚒️ Crafting <span className="text-green">Lab</span></h1>
        <p>Click any grid cell to add items — recipes are detected automatically</p>
      </div>

      <div className="glass-card" style={{ padding: 32, marginBottom: 24 }}>
        <CraftingGrid value={grid} onChange={setGrid} />
      </div>

      {/* Result Info */}
      {result ? (
        <motion.div
          className="glass-card"
          style={{ padding: 24, borderColor: 'rgba(57,255,20,0.4)', background: 'rgba(57,255,20,0.04)' }}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          key={result.id}
        >
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 80, height: 80, filter: 'drop-shadow(0 0 12px rgba(57,255,20,0.5))' }}>
              <ItemIcon itemId={result.output} size={64} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ color: 'var(--neon-green)', fontSize: '1.4rem' }}>
                ✅ {result.name}
              </h2>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>
                {result.description}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                <span className="badge badge-green">{result.category}</span>
                <span className="badge badge-cyan">×{result.outputCount}</span>
                {result.shapeless && <span className="badge badge-stone">Shapeless</span>}
              </div>
            </div>
            <button className="btn btn-secondary" onClick={copyRecipe}>📋 Copy</button>
          </div>
        </motion.div>
      ) : (
        <div className="glass-card" style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12, opacity: 0.3 }}>?</div>
          <p>Place items in the grid above to detect a recipe.</p>
          <p style={{ fontSize: '0.82rem', marginTop: 6 }}>
            Try: place <strong style={{ color: 'var(--neon-green)' }}>Oak Planks</strong> in 2×2 for a Crafting Table!
          </p>
        </div>
      )}

      {/* Tips */}
      <div style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 14, fontSize: '1rem' }}>💡 Quick Tips</h3>
        <div className="grid-3">
          {[
            { tip: '⛏️ Pickaxe', hint: 'Place 3 materials on top row + 2 sticks below center' },
            { tip: '⚔️ Sword', hint: '2 materials stacked in center column + 1 stick below' },
            { tip: '📦 Chest', hint: '8 planks in a ring pattern (hollow center)' },
          ].map(t => (
            <div key={t.tip} className="glass-card" style={{ padding: 16 }}>
              <div style={{ fontWeight: 800, marginBottom: 6, fontSize: '0.9rem' }}>{t.tip}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.hint}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
