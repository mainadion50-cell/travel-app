import axios from 'axios'

const api = axios.create({
  baseURL: 'https://travel-server-n663.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach token to every request if available
// Uses adminToken for /admin/* routes, tg_token for everything else
api.interceptors.request.use((config) => {
  const isAdminRoute = config.url?.startsWith('/admin')
  const token = isAdminRoute
    ? localStorage.getItem('adminToken')
    : localStorage.getItem('tg_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || ''
    const isAdminRoute = url.startsWith('/admin')
    const isAuthRoute = url.startsWith('/auth')
    if (error.response?.status === 401 && !isAdminRoute && !isAuthRoute) {
      localStorage.removeItem('tg_user')
      localStorage.removeItem('tg_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
