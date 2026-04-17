import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ 
    username: '', 
    password: '' 
  });

  const [loading, setLoading] = useState(false);

  // Redirect if already logged in as admin
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    let adminUser = null;
    
    try {
      adminUser = JSON.parse(localStorage.getItem('adminUser'));
    } catch (e) {}

    if (adminToken && adminUser?.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async () => {
    if (!form.username || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/admin/login', {
        email: form.username,
        password: form.password,
      });

      if (data.token && data.role === 'admin') {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify({
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
        }));

        toast.success('Welcome, Admin!');
        setTimeout(() => {
          navigate('/admin/dashboard', { replace: true });
        }, 800);
      } else {
        toast.error('Access denied. This account is not an admin.');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <ToastContainer theme="dark" />

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-2xl mx-auto mb-4">
            TG
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
          <p className="text-zinc-400 mt-2 text-sm">TravelGroup Administration</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Sign in to Admin</h2>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Email</label>
              <input
                type="email"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-600"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-3.5 rounded-2xl font-semibold text-white mt-2 transition"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </div>

        <p className="text-center text-zinc-600 text-xs mt-6">
          TravelGroup Admin · Restricted Access
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;