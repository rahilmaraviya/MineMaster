import { useState } from 'react';
import { ITEMS } from '../data/recipes.js';
import ItemIcon from './ItemIcon.jsx';
import useRecipeStore from '../store/recipeStore.js';

const EMPTY_GRID = Array(9).fill('');

export default function CraftingGrid({ value, onChange, readOnly = false }) {
  const [pickerCell, setPickerCell] = useState(null);
  const matchGrid = useRecipeStore(s => s.matchGrid);

  // Lazily import ItemPicker to avoid circular deps
  const [ItemPicker, setItemPicker] = useState(null);
  if (!ItemPicker) {
    import('./ItemPicker.jsx').then(m => setItemPicker(() => m.default));
  }

  const grid = value || EMPTY_GRID;
  const result = matchGrid(grid);

  const handleSelect = (itemId) => {
    const newGrid = [...grid];
    newGrid[pickerCell] = itemId;
    onChange?.(newGrid);
    setPickerCell(null);
  };

  const clearCell = (e, idx) => {
    e.stopPropagation();
    const newGrid = [...grid];
    newGrid[idx] = '';
    onChange?.(newGrid);
  };

  const clearAll = () => onChange?.(EMPTY_GRID);

  const outputItem = result ? ITEMS[result.output] : null;

  return (
    <>
      <div className="crafting-section">
        <div className="crafting-grid-wrapper">
          <span className="crafting-grid-label">Crafting Grid</span>
          <div className="crafting-grid">
            {grid.map((cell, idx) => {
              const item = cell ? ITEMS[cell] : null;
              return (
                <div
                  key={idx}
                  className={`grid-cell ${item ? 'filled' : ''}`}
                  onClick={() => !readOnly && setPickerCell(idx)}
                  title={item ? item.name : 'Click to add item'}
                >
                  {item ? (
                    <>
                      <ItemIcon itemId={cell} size={40} />
                      <span className="cell-name">{item.name}</span>
                      {!readOnly && (
                        <button className="clear-btn" onClick={e => clearCell(e, idx)}>✕</button>
                      )}
                    </>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>+</span>
                  )}
                </div>
              );
            })}
          </div>
          {!readOnly && (
            <button
              className="btn btn-sm"
              style={{ background: 'transparent', color: 'var(--crimson)', border: '1px solid var(--crimson)', marginTop: 4 }}
              onClick={clearAll}
            >
              ✕ Clear All
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div className="crafting-arrow">→</div>
          <div className="result-box">
            <div className={`result-slot ${result ? 'has-result' : ''}`}>
              {result ? (
                <>
                  <ItemIcon itemId={result.output} size={50} />
                  {result.outputCount > 1 && <span className="result-count">×{result.outputCount}</span>}
                </>
              ) : (
                <span style={{ color: 'var(--text-muted)', fontSize: '1.4rem' }}>?</span>
              )}
            </div>
            {result && (
              <div style={{ textAlign: 'center' }}>
                <div className="result-name">{result.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                  ×{result.outputCount} crafted
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {pickerCell !== null && ItemPicker && (
        <ItemPicker
          onSelect={handleSelect}
          onClose={() => setPickerCell(null)}
        />
      )}
    </>
  );
}
