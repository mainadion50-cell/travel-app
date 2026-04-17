import axios from 'axios';

const api = axios.create({
  baseURL: 'https://travel-server-n663.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request Interceptor - Attach correct token
api.interceptors.request.use((config) => {
  const url = config.url || '';

  // Admin routes use adminToken
  if (url.startsWith('/admin') || url.includes('/admin/')) {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  } 
  // Regular routes use tg_token
  else {
    const tgToken = localStorage.getItem('tg_token');
    if (tgToken) {
      config.headers.Authorization = `Bearer ${tgToken}`;
    }
  }

  return config;
});

// Response Interceptor - Improved to prevent unwanted redirects on admin routes
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const isAdminRoute = url.startsWith('/admin') || url.includes('/admin/');
    const isAuthRoute = url.startsWith('/auth');

    // Only auto-redirect to login for regular user routes on 401
    // Do NOT redirect for admin routes or auth routes
    if (error.response?.status === 401) {
      if (!isAdminRoute && !isAuthRoute) {
        // Regular user session expired
        localStorage.removeItem('tg_user');
        localStorage.removeItem('tg_token');
        window.location.href = '/login';
      }
      // For admin routes: do nothing here (let Admin.jsx handle the error)
      // For auth routes: let the login/register component handle the error
    }

    return Promise.reject(error);
  }
);

export default api;
