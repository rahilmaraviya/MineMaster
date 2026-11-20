import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import useRecipeStore from '../../store/recipeStore.js';
import { ITEMS, CATEGORIES } from '../../data/recipes.js';
import RecipeCard from '../../components/RecipeCard.jsx';
import CraftingGrid from '../../components/CraftingGrid.jsx';
import ItemIcon from '../../components/ItemIcon.jsx';

export default function RecipeBrowser() {
  const search = useRecipeStore(s => s.search);
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('all');
  const [selected, setSelected] = useState(null);

  const recipes = useMemo(() => search(query, cat), [query, cat, search]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📖 Recipe <span className="text-green">Browser</span></h1>
        <p>Browse all {recipes.length} Minecraft crafting recipes</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar" style={{ flex: '1', minWidth: 200 }}>
          <span className="search-icon">🔍</span>
          <input
            className="input"
            placeholder="Search recipes, materials, tags..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`cat-pill ${cat === c ? 'active' : ''}`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
        Showing <strong style={{ color: 'var(--neon-green)' }}>{recipes.length}</strong> recipes
        {query && <> for "<strong>{query}</strong>"</>}
      </div>

      {/* Recipe Grid */}
      {recipes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No recipes found</h3>
          <p>Try a different search term or category</p>
          <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={() => { setQuery(''); setCat('all'); }}>Clear Filters</button>
        </div>
      ) : (
        <motion.div className="grid-auto" layout>
          {recipes.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <RecipeCard recipe={r} onClick={setSelected} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Recipe Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <motion.div
            className="modal-box"
            style={{ maxWidth: 640, maxHeight: '90vh', overflow: 'auto' }}
            onClick={e => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ItemIcon itemId={selected.output} size={28} />
                {selected.name}
              </h3>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                <span className="badge badge-green">{selected.category}</span>
                {selected.shapeless && <span className="badge badge-stone">Shapeless</span>}
                {selected.isCustom && <span className="badge badge-gold">Custom Recipe</span>}
                <span className="badge badge-cyan">×{selected.outputCount} yielded</span>
              </div>
              {selected.description && (
                <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: '0.9rem' }}>{selected.description}</p>
              )}
              <div style={{ overflowX: 'auto' }}>
                <CraftingGrid value={selected.grid} readOnly />
              </div>
              <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {(selected.tags || []).map(t => (
                  <span key={t} className="badge badge-stone">{t}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
