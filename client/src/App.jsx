import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';

import AdminLogin from './pages/Admin/AdminLogin';
import Admin from './pages/Admin/Admin';

const ProtectedRoute = ({ children }) => {
  const { user, token, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Loading...</div>;
  if (!token || !user) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  const adminUser = (() => {
    try { return JSON.parse(localStorage.getItem('adminUser')); } catch { return null; }
  })();

  if (!adminToken || !adminUser) return <Navigate to="/admin" replace />;
  if (adminUser.role !== 'admin') return <Navigate to="/admin" replace />;

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Regular User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Login - NO protection */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Protected Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;