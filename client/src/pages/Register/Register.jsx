import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Register = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const passwordRules = [
    { label: 'At least 8 characters', met: form.password.length >= 8 },
    { label: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(form.password) },
    { label: 'One number (0-9)', met: /[0-9]/.test(form.password) },
    { label: 'One special character (!@#$ etc.)', met: /[!@#$%^&*]/.test(form.password) },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    const allRulesMet = passwordRules.every(r => r.met)
    if (!allRulesMet) {
      toast.error('Password does not meet all requirements')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        phone: '+254' + form.phone,
        password: form.password,
      })
      login(
        { _id: data._id, name: data.name, email: data.email, role: data.role },
        data.token
      )
      toast.success(`Welcome, ${data.name}! Account created.`)
      setTimeout(() => {
        if (data.role === 'admin') navigate('/admin')
        else navigate('/dashboard')
      }, 1000)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
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

        <h2 className="text-3xl font-bold text-white mb-1">Create an account</h2>
        <p className="text-zinc-400 mb-8">Join and start managing your trips</p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Full Name */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Martin Luther"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-blue-600 transition"
            />
          </div>

          {/* Email */}
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

          {/* Phone Number */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Phone Number</label>
            <div className="flex gap-2">
              <div className="bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-white flex items-center gap-2 whitespace-nowrap select-none">
                🇰🇪 +254
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="000000000"
                value={form.phone}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 9)
                  setForm({ ...form, phone: val })
                }}
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-blue-600 transition"
              />
            </div>
            <p className="text-xs text-zinc-500 mt-1">{form.phone.length}/9 digits entered</p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-blue-600 transition pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition text-lg"
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
            <ul className="mt-2 space-y-1">
              {passwordRules.map((rule, i) => (
                <li key={i} className={`text-xs flex items-center gap-2 ${rule.met ? 'text-green-400' : 'text-zinc-500'}`}>
                  <span>{rule.met ? '✅' : '○'}</span> {rule.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-blue-600 transition pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition text-lg"
              >
                {showConfirm ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition py-3.5 rounded-2xl font-semibold text-white text-base"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-zinc-400 mt-8 text-sm">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-blue-500 hover:underline cursor-pointer font-medium"
          >
            Sign in here
          </span>
        </p>
      </div>
    </div>
  )
}

export default Register