import { ITEMS } from '../data/recipes.js';
import ItemIcon from './ItemIcon.jsx';

const CATEGORY_COLORS = {
  tools: 'cyan', weapons: 'red', armor: 'gold',
  blocks: 'green', food: 'green', redstone: 'red', misc: 'purple',
};

export default function RecipeCard({ recipe, onClick }) {
  const outputItem = ITEMS[recipe.output];
  const color = CATEGORY_COLORS[recipe.category] || 'stone';

  return (
    <div className="recipe-card" onClick={() => onClick?.(recipe)}>
      <div className="recipe-card-top">
        <div className="recipe-emoji-box">
          <ItemIcon itemId={recipe.output} size={40} />
        </div>
        <div className="recipe-info">
          <div className="recipe-name">{recipe.name}</div>
          <div className="recipe-meta">
            yields <strong style={{ color: 'var(--neon-green)' }}>×{recipe.outputCount}</strong>
          </div>
        </div>
      </div>

      {/* Mini 3x3 grid preview with real icons */}
      <div className="recipe-mini-grid">
        {recipe.grid.map((cell, i) => {
          const item = cell ? ITEMS[cell] : null;
          return (
            <div key={i} className={`mini-cell ${item ? 'filled' : ''}`} title={item?.name || ''}>
              {item && <ItemIcon itemId={cell} size={18} />}
            </div>
          );
        })}
      </div>

      <div className="recipe-card-bottom">
        <span className={`badge badge-${color}`}>{recipe.category}</span>
        {recipe.shapeless && <span className="badge badge-stone">Shapeless</span>}
        {recipe.isCustom && <span className="badge badge-gold">Custom</span>}
      </div>

      {recipe.description && (
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
          {recipe.description}
        </p>
      )}
    </div>
  );
}
