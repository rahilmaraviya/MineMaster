import { create } from 'zustand';

const API_URL = 'http://localhost:3001/recipes';

const useRecipeStore = create((set, get) => ({
  recipes: [],
  initialized: false,

  init: async () => {
    if (!get().initialized) {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        set({ recipes: data, initialized: true });
      } catch (err) {
        console.error('Failed to fetch recipes:', err);
      }
    }
  },

  getAll: () => get().recipes,
  getById: (id) => get().recipes.find(r => r.id === id),

  search: (query = '', category = 'all') => {
    return get().recipes.filter(r => {
      const q = query.toLowerCase();
      const matchQ = !q || r.name.toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q) ||
        (r.tags || []).some(t => t.toLowerCase().includes(q));
      const matchC = category === 'all' || r.category === category;
      return matchQ && matchC;
    });
  },

  addRecipe: async (recipe) => {
    const newR = { ...recipe, id: `custom_${Date.now()}`, isCustom: true, createdAt: new Date().toISOString() };
    
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newR)
      });
      if (res.ok) {
        set(state => ({ recipes: [newR, ...state.recipes] }));
        return newR;
      }
    } catch (err) {
      console.error(err);
    }
  },

  updateRecipe: async (id, updates) => {
    const updatedRecipe = { ...get().getById(id), ...updates, updatedAt: new Date().toISOString() };
    
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRecipe)
      });
      if (res.ok) {
        set(state => ({
          recipes: state.recipes.map(r => r.id === id ? updatedRecipe : r),
        }));
      }
    } catch (err) {
      console.error(err);
    }
  },

  deleteRecipe: async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        set(state => ({ recipes: state.recipes.filter(r => r.id !== id) }));
      }
    } catch (err) {
      console.error(err);
    }
  },

  matchGrid: (grid) => {
    const recipes = get().recipes;
    const norm = g => g.map(s => (s || '').trim());
    const userGrid = norm(grid);

    for (const recipe of recipes) {
      if (recipe.shapeless || !recipe.grid) continue;
      if (JSON.stringify(userGrid) === JSON.stringify(norm(recipe.grid))) return recipe;
    }
    return null;
  },

  getStats: () => {
    const { recipes } = get();
    return {
      total: recipes.length,
      custom: recipes.filter(r => r.isCustom).length,
      byCategory: recipes.reduce((acc, r) => { acc[r.category] = (acc[r.category] || 0) + 1; return acc; }, {}),
    };
  },
}));

export default useRecipeStore;
