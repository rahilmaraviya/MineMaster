import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import useRecipeStore from '../../store/recipeStore.js';
import { ITEMS, CATEGORIES } from '../../data/recipes.js';
import ItemPicker from '../../components/ItemPicker.jsx';
import ItemIcon from '../../components/ItemIcon.jsx';
import toast from 'react-hot-toast';

const EMPTY_GRID = Array(9).fill('');
const EMPTY_FORM = { name: '', output: '', outputCount: 1, category: 'misc', shapeless: false, description: '', tags: '' };

export default function RecipeEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById, addRecipe, updateRecipe } = useRecipeStore();

  const [form, setForm] = useState(EMPTY_FORM);
  const [grid, setGrid] = useState(EMPTY_GRID);
  const [pickerCell, setPickerCell] = useState(null);
  const [pickerFor, setPickerFor] = useState(null); // 'grid' | 'output'
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (id) {
      const r = getById(id);
      if (r) {
        setForm({ name: r.name, output: r.output, outputCount: r.outputCount, category: r.category, shapeless: r.shapeless, description: r.description || '', tags: (r.tags || []).join(', ') });
        setGrid(r.grid || EMPTY_GRID);
      }
    }
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.output) { toast.error('Name and output item are required!'); return; }
    const recipe = { ...form, outputCount: Number(form.outputCount), grid, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
    if (isEditMode) {
      updateRecipe(id, recipe);
      toast.success('Recipe updated! ✏️');
    } else {
      addRecipe(recipe);
      toast.success('Recipe added! 📖');
    }
    navigate('/admin/recipes');
  };

  const openGridPicker = (idx) => { setPickerCell(idx); setPickerFor('grid'); };
  const openOutputPicker = () => { setPickerFor('output'); };

  const handlePickerSelect = (itemId) => {
    if (pickerFor === 'grid') {
      const g = [...grid]; g[pickerCell] = itemId; setGrid(g);
    } else {
      set('output', itemId);
    }
    setPickerCell(null); setPickerFor(null);
  };

  const clearCell = (idx) => { const g = [...grid]; g[idx] = ''; setGrid(g); };
  const outputItem = form.output ? ITEMS[form.output] : null;

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="btn btn-sm btn-secondary" onClick={() => navigate('/admin/recipes')}>← Back</button>
        <div>
          <h1>{isEditMode ? '✏️' : '➕'} {isEditMode ? 'Edit' : 'Add'} <span className="text-gold">Recipe</span></h1>
          <p>{isEditMode ? 'Modify existing recipe' : 'Create a new crafting recipe'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="editor-layout">
          {/* Left: Form */}
          <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div className="form-group">
              <label>Recipe Name *</label>
              <input className="input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Diamond Pickaxe" required />
            </div>

            <div className="form-group">
              <label>Output Item *</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div
                  style={{ width: 52, height: 52, background: 'rgba(20,20,30,0.9)', border: '1.5px solid var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'var(--transition)' }}
                  onClick={openOutputPicker}
                >
                  {outputItem ? <ItemIcon itemId={outputItem.id} size={36} /> : <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>?</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <input className="input" value={outputItem?.name || ''} readOnly placeholder="Click icon to pick..." style={{ cursor: 'pointer' }} onClick={openOutputPicker} />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label>Yield Count</label>
                <input className="input" type="number" min={1} max={64} value={form.outputCount} onChange={e => set('outputCount', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select className="select" value={form.category} onChange={e => set('category', e.target.value)}>
                  {CATEGORIES.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea className="textarea" rows={2} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief description..." style={{ resize: 'vertical' }} />
            </div>

            <div className="form-group">
              <label>Tags (comma-separated)</label>
              <input className="input" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="basic, beginner, wood..." />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.shapeless} onChange={e => set('shapeless', e.target.checked)} style={{ width: 16, height: 16 }} />
                <span>Shapeless recipe (position of items doesn't matter)</span>
              </label>
            </div>
          </div>

          {/* Right: Grid Editor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ marginBottom: 16, fontSize: '0.95rem' }}>🔧 Crafting Grid</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 16 }}>Click a cell to assign an ingredient</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 70px)', gridTemplateRows: 'repeat(3, 70px)', gap: 5, marginBottom: 16 }}>
                {grid.map((cell, idx) => {
                  const item = cell ? ITEMS[cell] : null;
                  return (
                    <div
                      key={idx}
                      className={`editor-cell ${item ? 'filled' : ''}`}
                      onClick={() => openGridPicker(idx)}
                      title={item?.name || 'Click to add'}
                      style={{ position: 'relative' }}
                    >
                      {item ? (
                        <>
                          <ItemIcon itemId={cell} size={40} />
                          <button
                            style={{ position: 'absolute', top: 2, right: 4, background: 'none', border: 'none', color: 'var(--crimson)', cursor: 'pointer', fontSize: '0.65rem', opacity: 0.7, padding: 0 }}
                            onClick={e => { e.stopPropagation(); clearCell(idx); }}
                          >✕</button>
                        </>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>+</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <button type="button" className="btn btn-sm btn-danger" style={{ width: '100%' }} onClick={() => setGrid(EMPTY_GRID)}>✕ Clear Grid</button>
            </div>

            {/* Output Preview */}
            {outputItem && (
              <div className="glass-card" style={{ padding: 20, textAlign: 'center', borderColor: 'rgba(57,255,20,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 70, filter: 'drop-shadow(0 0 12px rgba(57,255,20,0.4))' }}>
                  <ItemIcon itemId={form.output} size={64} />
                </div>
                <div style={{ fontWeight: 800, marginTop: 8 }}>{form.name || outputItem.name}</div>
                <div style={{ color: 'var(--neon-green)', fontSize: '0.85rem' }}>×{form.outputCount}</div>
              </div>
            )}

            <button type="submit" className="btn btn-gold btn-lg" style={{ width: '100%' }}>
              {isEditMode ? '✏️ Update Recipe' : '➕ Save Recipe'}
            </button>
          </div>
        </div>
      </form>

      {pickerFor !== null && (
        <ItemPicker onSelect={handlePickerSelect} onClose={() => { setPickerFor(null); setPickerCell(null); }} />
      )}
    </div>
  );
}
