import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      login(
        { _id: data._id, name: data.name, email: data.email, role: data.role },
        data.token
      )
      toast.success(`Welcome back, ${data.name}!`)
      setTimeout(() => {
        if (data.role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/dashboard')
        }
      }, 1000)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <ToastContainer theme="dark" />
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-10 w-full max-w-md">

        {/* Close Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white text-2xl leading-none transition"
        >
          ✕
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-600 text-white font-bold text-xl w-10 h-10 flex items-center justify-center rounded-2xl">
            TG
          </div>
          <div>
            <h1 className="text-white text-2xl font-semibold">TravelGroup</h1>
            <p className="text-zinc-500 text-xs tracking-widest">MANAGEMENT SYSTEM</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-1">Welcome back</h2>
        <p className="text-zinc-400 mb-8">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-blue-600 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-blue-600 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition py-3.5 rounded-2xl font-semibold text-white text-base"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-zinc-400 mt-8 text-sm">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/register')}
            className="text-blue-500 hover:underline cursor-pointer font-medium"
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login