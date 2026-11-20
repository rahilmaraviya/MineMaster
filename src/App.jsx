import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

import useAuthStore from './store/authStore.js';
import useRecipeStore from './store/recipeStore.js';

// Auth
import ClientLogin from './pages/auth/ClientLogin.jsx';
import AdminLogin from './pages/auth/AdminLogin.jsx';

// Client Pages
import Home from './pages/client/Home.jsx';
import RecipeBrowser from './pages/client/RecipeBrowser.jsx';
import CraftingLab from './pages/client/CraftingLab.jsx';
import Quiz from './pages/client/Quiz.jsx';
import Profile from './pages/client/Profile.jsx';

// Admin Pages
import Dashboard from './pages/admin/Dashboard.jsx';
import RecipeManager from './pages/admin/RecipeManager.jsx';
import RecipeEditor from './pages/admin/RecipeEditor.jsx';
import UserManager from './pages/admin/UserManager.jsx';
import Analytics from './pages/admin/Analytics.jsx';

// Layout
import Navbar from './components/Navbar.jsx';
import AdminSidebar from './components/AdminSidebar.jsx';

// Protected routes
function ClientRoute({ children }) {
  const { isAuthenticated, currentUser } = useAuthStore();
  if (!isAuthenticated || currentUser?.role !== 'client') return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { isAuthenticated, currentUser } = useAuthStore();
  if (!isAuthenticated || currentUser?.role !== 'admin') return <Navigate to="/admin/login" replace />;
  return children;
}

function ClientLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">{children}</div>
    </div>
  );
}

export default function App() {
  const init = useRecipeStore(s => s.init);
  const initAuth = useAuthStore(s => s.initAuth);
  useEffect(() => { initAuth(); init(); }, [init, initAuth]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#0d0d14', color: '#f0f0f0', border: '1px solid rgba(57,255,20,0.3)' },
          success: { iconTheme: { primary: '#39ff14', secondary: '#000' } },
          error: { iconTheme: { primary: '#e63946', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<ClientLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Client Routes */}
        <Route path="/" element={<ClientRoute><ClientLayout><Home /></ClientLayout></ClientRoute>} />
        <Route path="/browse" element={<ClientRoute><ClientLayout><RecipeBrowser /></ClientLayout></ClientRoute>} />
        <Route path="/lab" element={<ClientRoute><ClientLayout><CraftingLab /></ClientLayout></ClientRoute>} />
        <Route path="/quiz" element={<ClientRoute><ClientLayout><Quiz /></ClientLayout></ClientRoute>} />
        <Route path="/profile" element={<ClientRoute><ClientLayout><Profile /></ClientLayout></ClientRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout><Dashboard /></AdminLayout></AdminRoute>} />
        <Route path="/admin/recipes" element={<AdminRoute><AdminLayout><RecipeManager /></AdminLayout></AdminRoute>} />
        <Route path="/admin/recipe-editor" element={<AdminRoute><AdminLayout><RecipeEditor /></AdminLayout></AdminRoute>} />
        <Route path="/admin/recipe-editor/:id" element={<AdminRoute><AdminLayout><RecipeEditor /></AdminLayout></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminLayout><UserManager /></AdminLayout></AdminRoute>} />
        <Route path="/admin/analytics" element={<AdminRoute><AdminLayout><Analytics /></AdminLayout></AdminRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
