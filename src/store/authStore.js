import { create } from 'zustand';

const API_URL = 'http://localhost:3001/users';

const useAuthStore = create((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  users: [],
  error: null,

  // Simple load on startup
  initAuth: () => {
    const user = localStorage.getItem('minemaster_user');
    if (user) {
      set({ currentUser: JSON.parse(user), isAuthenticated: true });
    }
  },

  // Fetch all users to populate the state
  fetchAllUsers: async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      set({ users: data });
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  },

  login: async (email, password, role) => {
    try {
      // 1. Fetch current users from our db.json
      const res = await fetch(API_URL);
      const users = await res.json();
      set({ users });

      // 2. Find matching user
      const user = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() &&
             u.password === password &&
             u.role === role &&
             u.active
      );

      if (user) {
        localStorage.setItem('minemaster_user', JSON.stringify(user));
        set({ currentUser: user, isAuthenticated: true, error: null });
        return { success: true };
      }
      
      // Error handling
      const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!exists) set({ error: 'No account found with this email.' });
      else if (exists.role !== role) set({ error: `This account is not a ${role}. Try the other login.` });
      else if (!exists.active) set({ error: 'Account is deactivated. Contact admin.' });
      else set({ error: 'Wrong password.' });
      
      return { success: false };
    } catch (err) {
      set({ error: 'Could not connect to database.' });
      return { success: false };
    }
  },

  register: async (name, email, password) => {
    try {
      const { users } = get();
      if (!name.trim() || !email.trim() || !password.trim()) {
        set({ error: 'All fields are required.' });
        return { success: false };
      }
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        set({ error: 'Email already registered.' });
        return { success: false };
      }

      const newUser = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: email.toLowerCase(),
        password,
        role: 'client',
        createdAt: new Date().toISOString(),
        active: true,
        xp: 0,
        quizHistory: [],
      };

      // Create user in db.json
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      
      if (!res.ok) throw new Error('Failed to register');
      
      set(state => ({ users: [...state.users, newUser], error: null }));
      return { success: true };
    } catch (err) {
      set({ error: 'Failed to connect to database.' });
      return { success: false };
    }
  },

  logout: () => {
    localStorage.removeItem('minemaster_user');
    set({ currentUser: null, isAuthenticated: false, error: null });
  },

  addXP: async (amount) => {
    const { currentUser } = get();
    if (!currentUser) return;
    const updated = { ...currentUser, xp: (currentUser.xp || 0) + amount };
    
    // Update db.json
    try {
      await fetch(`${API_URL}/${currentUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xp: updated.xp })
      });
      localStorage.setItem('minemaster_user', JSON.stringify(updated));
      set({ currentUser: updated });
    } catch (err) {
      console.error(err);
    }
  },

  addQuizHistory: async (record) => {
    const { currentUser } = get();
    if (!currentUser) return;
    const history = [record, ...(currentUser.quizHistory || [])].slice(0, 20);
    const updated = { ...currentUser, quizHistory: history };
    
    try {
      await fetch(`${API_URL}/${currentUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizHistory: history })
      });
      localStorage.setItem('minemaster_user', JSON.stringify(updated));
      set({ currentUser: updated });
    } catch (err) {
      console.error(err);
    }
  },

  // Admin actions
  toggleUserActive: async (userId) => {
    const user = get().users.find(u => u.id === userId);
    if (!user) return;
    
    await fetch(`${API_URL}/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !user.active })
    });
    get().fetchAllUsers();
  },

  changeUserRole: async (userId, role) => {
    await fetch(`${API_URL}/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    get().fetchAllUsers();
  },

  deleteUser: async (userId) => {
    await fetch(`${API_URL}/${userId}`, { method: 'DELETE' });
    get().fetchAllUsers();
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
