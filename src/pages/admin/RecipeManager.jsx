import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useRecipeStore from '../../store/recipeStore.js';
import { ITEMS, CATEGORIES } from '../../data/recipes.js';
import ItemIcon from '../../components/ItemIcon.jsx';
import toast from 'react-hot-toast';

export default function RecipeManager() {
  const navigate = useNavigate();
  const { search, deleteRecipe } = useRecipeStore();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('all');
  const [toDelete, setToDelete] = useState(null);

  const recipes = useMemo(() => search(query, cat), [query, cat, search]);

  const handleDelete = (id) => {
    deleteRecipe(id);
    toast.success('Recipe deleted!');
    setToDelete(null);
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>📖 Recipe <span className="text-gold">Manager</span></h1>
          <p>Manage all {recipes.length} recipes</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/admin/recipe-editor')}>➕ Add Recipe</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
          <span className="search-icon">🔍</span>
          <input
            className="input"
            placeholder="Search recipes..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <select className="select" style={{ width: 'auto', minWidth: 130 }} value={cat} onChange={e => setCat(e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Output</th>
              <th>Name</th>
              <th>Category</th>
              <th>Yields</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No recipes found
                </td>
              </tr>
            ) : recipes.map((r, i) => (
              <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                <td style={{ width: 40 }}><ItemIcon itemId={r.output} size={32} /></td>
                <td>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{r.name}</div>
                  {r.isCustom && <span className="badge badge-gold" style={{ marginTop: 3 }}>Custom</span>}
                </td>
                <td><span className="badge badge-stone" style={{ textTransform: 'capitalize' }}>{r.category}</span></td>
                <td style={{ color: 'var(--neon-green)', fontWeight: 700 }}>×{r.outputCount}</td>
                <td><span className={`badge ${r.shapeless ? 'badge-cyan' : 'badge-purple'}`}>{r.shapeless ? 'Shapeless' : 'Shaped'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => navigate(`/admin/recipe-editor/${r.id}`)}
                    >✏️ Edit</button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => setToDelete(r)}
                    >🗑️</button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirm Modal */}
      {toDelete && (
        <div className="modal-overlay" onClick={() => setToDelete(null)}>
          <div className="glass-card" style={{ padding: 32, maxWidth: 400, width: '100%', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🗑️</div>
            <h3 style={{ marginBottom: 8 }}>Delete Recipe?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
              Are you sure you want to delete "<strong>{toDelete.name}</strong>"? This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="btn btn-danger" onClick={() => handleDelete(toDelete.id)}>🗑️ Delete</button>
              <button className="btn btn-secondary" onClick={() => setToDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
