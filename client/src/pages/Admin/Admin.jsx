import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Admin = () => {
  const navigate = useNavigate()
  const adminUser = (() => {
    try { return JSON.parse(localStorage.getItem('adminUser') || '{}') } catch { return {} }
  })()
  const adminToken = localStorage.getItem('adminToken')

  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState([])
  const [trips, setTrips] = useState([])
  const [bookings, setBookings] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  const [showTripModal, setShowTripModal] = useState(false)
  const [tripForm, setTripForm] = useState({
    title: '', description: '', destination: '',
    startDate: '', endDate: '', budget: '', itinerary: ''
  })
  const [savingTrip, setSavingTrip] = useState(false)

  useEffect(() => {
    if (!adminToken) {
      navigate('/admin', { replace: true })
      return
    }
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      // api.js interceptor will automatically attach adminToken for /admin/* routes
      const [usersRes, tripsRes, bookingsRes, paymentsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/trips'),
        api.get('/admin/bookings'),
        api.get('/admin/payments'),
      ])
      setUsers(usersRes.data)
      setTrips(Array.isArray(tripsRes.data) ? tripsRes.data : tripsRes.data?.data || [])
      setBookings(bookingsRes.data)
      setPayments(paymentsRes.data)
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error('Session expired. Please log in again.')
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        navigate('/admin', { replace: true })
      } else {
        toast.error('Failed to load admin data')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/admin', { replace: true })
  }

  const handleCreateTrip = async (e) => {
    e.preventDefault()
    setSavingTrip(true)
    try {
      await api.post('/trips', tripForm)
      toast.success('Trip created successfully!')
      setShowTripModal(false)
      setTripForm({ title: '', description: '', destination: '', startDate: '', endDate: '', budget: '', itinerary: '' })
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create trip')
    } finally {
      setSavingTrip(false)
    }
  }

  const handleDeleteTrip = async (id) => {
    if (!window.confirm('Delete this trip?')) return
    try {
      await api.delete(`/trips/${id}`)
      toast.success('Trip deleted')
      fetchAll()
    } catch {
      toast.error('Failed to delete trip')
    }
  }

  const handleUpdateTripStatus = async (id, status) => {
    try {
      await api.put(`/trips/${id}`, { status })
      toast.success('Status updated')
      fetchAll()
    } catch {
      toast.error('Failed to update status')
    }
  }

  const statusColor = (status) => {
    const map = {
      upcoming: 'text-blue-400', ongoing: 'text-green-400',
      completed: 'text-zinc-400', cancelled: 'text-red-400',
      pending: 'text-yellow-400', confirmed: 'text-green-400',
      success: 'text-green-400', failed: 'text-red-400',
      user: 'text-zinc-300', admin: 'text-purple-400', organizer: 'text-blue-400'
    }
    return map[status] || 'text-zinc-400'
  }

  const totalRevenue = payments.filter(p => p.status === 'success').reduce((s, p) => s + p.amount, 0)
  const pendingBookings = bookings.filter(b => b.status === 'pending').length
  const tabs = ['overview', 'trips', 'users', 'bookings', 'payments']

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <ToastContainer theme="dark" />

      {/* TOPBAR */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center font-bold text-sm">TG</div>
          <div>
            <span className="font-semibold text-lg">TravelGroup</span>
            <span className="ml-3 text-xs bg-purple-600/30 text-purple-300 px-2 py-0.5 rounded-full">Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-zinc-400 text-sm hidden sm:block">{adminUser?.name || 'Admin'}</span>
          <button onClick={handleLogout} className="text-sm text-zinc-400 hover:text-white border border-zinc-700 px-4 py-2 rounded-xl transition">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-zinc-400 mt-1">Full control over users, trips, bookings, and payments</p>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-8 border-b border-zinc-800 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium capitalize transition border-b-2 -mb-px ${
                activeTab === tab ? 'border-purple-500 text-white' : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >{tab}</button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-zinc-400">Loading...</div>
        ) : (
          <>
            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  {[
                    { label: 'Total Users', value: users.length, icon: '👥' },
                    { label: 'Total Trips', value: trips.length, icon: '✈️' },
                    { label: 'Pending Bookings', value: pendingBookings, icon: '⏳' },
                    { label: 'Total Revenue', value: `KES ${totalRevenue.toLocaleString()}`, icon: '💰' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                      <div className="text-3xl mb-3">{stat.icon}</div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-zinc-400 text-sm mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="font-semibold mb-4">Recent Bookings</h3>
                    {bookings.slice(0, 5).map((b, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0">
                        <div>
                          <div className="text-sm font-medium">{b.user?.name || 'User'}</div>
                          <div className="text-xs text-zinc-400">{b.trip?.title || '—'}</div>
                        </div>
                        <span className={`text-xs font-semibold capitalize ${statusColor(b.status)}`}>{b.status}</span>
                      </div>
                    ))}
                    {bookings.length === 0 && <div className="text-zinc-400 text-sm">No bookings yet.</div>}
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="font-semibold mb-4">Recent Payments</h3>
                    {payments.slice(0, 5).map((p, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0">
                        <div>
                          <div className="text-sm font-medium">{p.user?.name || 'User'}</div>
                          <div className="text-xs text-zinc-400">{p.mpesaReceiptNumber || '—'}</div>
                        </div>
                        <span className={`text-xs font-bold ${statusColor(p.status)}`}>KES {p.amount?.toLocaleString()}</span>
                      </div>
                    ))}
                    {payments.length === 0 && <div className="text-zinc-400 text-sm">No payments yet.</div>}
                  </div>
                </div>
              </div>
            )}

            {/* TRIPS */}
            {activeTab === 'trips' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">All Trips ({trips.length})</h2>
                  <button
                    onClick={() => setShowTripModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition"
                  >
                    + New Trip
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  {trips.map((trip, i) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex justify-between items-start gap-4 flex-wrap">
                      <div>
                        <div className="font-semibold text-lg">{trip.title}</div>
                        <div className="text-zinc-400 text-sm mt-1">📍 {trip.destination} · 👥 {trip.members?.length || 0} members · 💰 KES {trip.budget?.toLocaleString()}</div>
                        <div className="text-zinc-400 text-sm">📅 {new Date(trip.startDate).toLocaleDateString()} → {new Date(trip.endDate).toLocaleDateString()}</div>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <select
                          value={trip.status}
                          onChange={e => handleUpdateTripStatus(trip._id, e.target.value)}
                          className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                        >
                          {['upcoming', 'ongoing', 'completed', 'cancelled'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleDeleteTrip(trip._id)}
                          className="text-red-400 hover:text-red-300 border border-red-800 hover:border-red-600 px-4 py-2 rounded-xl text-sm transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {trips.length === 0 && <div className="text-center py-20 text-zinc-400">No trips yet. Create one!</div>}
                </div>
              </div>
            )}

            {/* USERS */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">All Users ({users.length})</h2>
                <div className="flex flex-col gap-3">
                  {users.map((u, i) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex justify-between items-center">
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-zinc-400 text-sm">{u.email} · {u.phone}</div>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-semibold capitalize ${statusColor(u.role)}`}>{u.role}</span>
                        <div className="text-zinc-500 text-xs mt-1">Joined {new Date(u.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BOOKINGS */}
            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">All Bookings ({bookings.length})</h2>
                <div className="flex flex-col gap-3">
                  {bookings.map((b, i) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex justify-between items-center">
                      <div>
                        <div className="font-medium">{b.user?.name || 'User'}</div>
                        <div className="text-zinc-400 text-sm">Trip: {b.trip?.title || '—'} · {b.trip?.destination}</div>
                        <div className="text-zinc-400 text-sm">Booked: {new Date(b.bookingDate).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold capitalize ${statusColor(b.status)}`}>{b.status}</div>
                        <div className="font-bold">KES {b.amount?.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                  {bookings.length === 0 && <div className="text-center py-20 text-zinc-400">No bookings yet.</div>}
                </div>
              </div>
            )}

            {/* PAYMENTS */}
            {activeTab === 'payments' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">All Payments ({payments.length})</h2>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-3 text-sm">
                    Total Revenue: <span className="text-green-400 font-bold">KES {totalRevenue.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {payments.map((p, i) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex justify-between items-center">
                      <div>
                        <div className="font-medium">{p.user?.name || 'User'}</div>
                        <div className="text-zinc-400 text-sm">📱 {p.phone}</div>
                        <div className="text-zinc-400 text-sm">Receipt: {p.mpesaReceiptNumber || '—'}</div>
                        <div className="text-zinc-500 text-xs">{new Date(p.createdAt).toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold capitalize ${statusColor(p.status)}`}>{p.status}</div>
                        <div className="font-bold text-lg">KES {p.amount?.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                  {payments.length === 0 && <div className="text-center py-20 text-zinc-400">No payments yet.</div>}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* CREATE TRIP MODAL */}
      {showTripModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 overflow-y-auto py-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-lg relative">
            <button onClick={() => setShowTripModal(false)} className="absolute top-5 right-5 text-zinc-400 hover:text-white text-xl">✕</button>
            <h2 className="text-2xl font-bold mb-6">Create New Trip</h2>
            <form onSubmit={handleCreateTrip} className="space-y-4">
              {[
                { label: 'Trip Title', name: 'title', type: 'text', placeholder: 'e.g. Maasai Mara Safari' },
                { label: 'Destination', name: 'destination', type: 'text', placeholder: 'e.g. Narok, Kenya' },
                { label: 'Start Date', name: 'startDate', type: 'date' },
                { label: 'End Date', name: 'endDate', type: 'date' },
                { label: 'Budget per Person (KES)', name: 'budget', type: 'number', placeholder: 'e.g. 15000' },
              ].map(field => (
                <div key={field.name}>
                  <label className="block text-sm text-zinc-400 mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={tripForm[field.name]}
                    onChange={e => setTripForm({ ...tripForm, [e.target.name]: e.target.value })}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Description</label>
                <textarea
                  name="description"
                  placeholder="Describe the trip..."
                  value={tripForm.description}
                  onChange={e => setTripForm({ ...tripForm, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition resize-none"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Itinerary (optional)</label>
                <textarea
                  name="itinerary"
                  placeholder="Day 1: Arrive at camp..."
                  value={tripForm.itinerary}
                  onChange={e => setTripForm({ ...tripForm, itinerary: e.target.value })}
                  rows={3}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={savingTrip}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 py-3.5 rounded-2xl font-semibold transition"
              >
                {savingTrip ? 'Creating...' : 'Create Trip'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin