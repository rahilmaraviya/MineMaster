import { useState } from 'react';
import { ITEMS } from '../data/recipes.js';
import ItemIcon from './ItemIcon.jsx';

const ITEM_LIST = Object.values(ITEMS);
const ITEM_CATEGORIES = ['all', ...new Set(ITEM_LIST.map(i => i.category))];

export default function ItemPicker({ onSelect, onClose }) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('all');

  const filtered = ITEM_LIST.filter(item => {
    const matchS = !search || item.name.toLowerCase().includes(search.toLowerCase());
    const matchC = cat === 'all' || item.category === cat;
    return matchS && matchC;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Select Item</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-search">
          <input
            className="input"
            placeholder="🔍 Search items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>
        <div className="modal-categories">
          {ITEM_CATEGORIES.map(c => (
            <button
              key={c}
              className={`cat-pill ${cat === c ? 'active' : ''}`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="modal-items">
          {filtered.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
              No items found
            </div>
          ) : (
            filtered.map(item => (
              <button
                key={item.id}
                className="item-option"
                onClick={() => { onSelect(item.id); onClose(); }}
                title={item.name}
              >
                <ItemIcon itemId={item.id} size={36} />
                <span className="item-label">{item.name}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
