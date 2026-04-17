import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state for booking a trip
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [payPhone, setPayPhone] = useState('');
  const [paying, setPaying] = useState(false);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [tripsRes, bookingsRes, paymentsRes] = await Promise.allSettled([
        api.get('/trips'),
        api.get('/bookings/my'),
        api.get('/payments/my'),
      ]);

      const tripsData = tripsRes.status === 'fulfilled'
        ? (tripsRes.value.data?.data || tripsRes.value.data || [])
        : [];

      const bookingsData = bookingsRes.status === 'fulfilled'
        ? (bookingsRes.value.data?.data || bookingsRes.value.data || [])
        : [];

      const paymentsData = paymentsRes.status === 'fulfilled'
        ? (paymentsRes.value.data?.data || paymentsRes.value.data || [])
        : [];

      setTrips(tripsData);
      setBookings(bookingsData);
      setPayments(paymentsData);

    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBookTrip = (trip) => {
    setSelectedTrip(trip);
    setPayPhone('');
    setPaymentSubmitted(false);
    setShowBookModal(true);
  };

  const handleCloseModal = () => {
    setShowBookModal(false);
    setPayPhone('');
    setPaymentSubmitted(false);
    setPaying(false);
  };

  const handlePayment = async () => {
    if (!payPhone || payPhone.length !== 9) {
      toast.error('Enter a valid 9-digit M-Pesa number');
      return;
    }
    setPaying(true);

    try {
      // Step 1: Create the booking
      const bookingRes = await api.post('/bookings', {
        tripId: selectedTrip._id,
        amount: selectedTrip.budget,
      });

      const bookingId = bookingRes.data?._id || bookingRes.data?.data?._id;

      if (!bookingId) throw new Error('Booking creation failed');

      // Step 2: Fake 3-second M-Pesa delay then simulate payment
      await new Promise(resolve => setTimeout(resolve, 3000));

      await api.post('/payments/simulate', {
        bookingId,
        phone: `+254${payPhone}`,
        amount: selectedTrip.budget,
      });

      setPaying(false);
      setPaymentSubmitted(true);

      // Refresh data so bookings/payments tabs update
      fetchAll();

    } catch (err) {
      setPaying(false);
      toast.error(err.response?.data?.message || 'Payment failed. Please try again.');
    }
  };

  const statusColor = (status) => {
    const map = {
      upcoming: 'text-blue-400', ongoing: 'text-green-400',
      completed: 'text-zinc-400', cancelled: 'text-red-400',
      pending: 'text-yellow-400', confirmed: 'text-green-400',
      success: 'text-green-400', failed: 'text-red-400',
    };
    return map[status] || 'text-zinc-400';
  };

  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const totalSpent = payments.filter(p => p.status === 'success').reduce((sum, p) => sum + (p.amount || 0), 0);

  const tabs = ['overview', 'trips', 'bookings', 'payments'];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <ToastContainer theme="dark" />

      {/* TOPBAR */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-sm">TG</div>
          <span className="font-semibold text-lg">TravelGroup</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-zinc-400 text-sm hidden sm:block">Hello, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-4 py-2 rounded-xl transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-zinc-400 mt-1">Manage your trips, bookings, and payments</p>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-8 border-b border-zinc-800 pb-0 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium capitalize transition border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-zinc-400">Loading your data...</div>
        ) : (
          <>
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  {[
                    { label: 'Available Trips', value: trips.length, icon: '✈️' },
                    { label: 'My Bookings', value: bookings.length, icon: '📅' },
                    { label: 'Confirmed', value: confirmedBookings, icon: '✅' },
                    { label: 'Total Spent', value: `KES ${totalSpent.toLocaleString()}`, icon: '💳' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                      <div className="text-3xl mb-3">{stat.icon}</div>
                      <div className="text-2xl font-bold text-blue-400">{stat.value}</div>
                      <div className="text-zinc-400 text-sm mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
                {bookings.length === 0 ? (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center text-zinc-400">
                    <div className="text-4xl mb-3">📋</div>
                    <p>No bookings yet. Browse trips to get started!</p>
                    <button
                      onClick={() => setActiveTab('trips')}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl text-sm font-medium transition"
                    >
                      Browse Trips
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {bookings.slice(0, 3).map((b, i) => (
                      <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex justify-between items-center">
                        <div>
                          <div className="font-medium">{b.trip?.title || 'Trip'}</div>
                          <div className="text-zinc-400 text-sm">{b.trip?.destination}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium capitalize ${statusColor(b.status)}`}>{b.status}</div>
                          <div className="text-zinc-400 text-sm">KES {b.amount?.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TRIPS TAB */}
            {activeTab === 'trips' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Available Trips</h2>
                {trips.length === 0 ? (
                  <div className="text-center py-20 text-zinc-400">No trips available at the moment.</div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {trips.map((trip) => (
                      <div
                        key={trip._id}
                        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7 hover:border-blue-600/40 transition-all"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-semibold">{trip.title}</h3>
                          <span className={`text-xs font-bold capitalize px-3 py-1 rounded-full bg-zinc-800 ${statusColor(trip.status)}`}>
                            {trip.status}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-sm mb-4">{trip.description}</p>
                        <div className="flex flex-col gap-1 text-sm text-zinc-400 mb-6">
                          <span>📍 {trip.destination}</span>
                          <span>📅 {new Date(trip.startDate).toLocaleDateString()} → {new Date(trip.endDate).toLocaleDateString()}</span>
                          <span>💰 KES {trip.budget?.toLocaleString()} per person</span>
                        </div>
                        <button
                          onClick={() => handleBookTrip(trip)}
                          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-2xl font-medium transition"
                        >
                          Book This Trip
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">My Bookings</h2>
                {bookings.length === 0 ? (
                  <div className="text-center py-20 text-zinc-400">No bookings yet.</div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {bookings.map((b, i) => (
                      <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-lg">{b.trip?.title}</div>
                          <div className="text-zinc-400 text-sm">📍 {b.trip?.destination}</div>
                          <div className="text-zinc-400 text-sm">📅 Booked on {new Date(b.bookingDate).toLocaleDateString()}</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold capitalize ${statusColor(b.status)}`}>{b.status}</div>
                          <div className="text-white font-bold">KES {b.amount?.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PAYMENTS TAB */}
            {activeTab === 'payments' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Payment History</h2>
                {payments.length === 0 ? (
                  <div className="text-center py-20 text-zinc-400">No payment history yet.</div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {payments.map((p, i) => (
                      <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex justify-between items-center">
                        <div>
                          <div className="font-medium">{p.mpesaReceiptNumber || 'Payment'}</div>
                          <div className="text-zinc-400 text-sm">📱 {p.phone}</div>
                          <div className="text-zinc-400 text-sm">🗓 {new Date(p.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold capitalize ${statusColor(p.status)}`}>{p.status}</div>
                          <div className="text-white font-bold">KES {p.amount?.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* BOOKING MODAL */}
      {showBookModal && selectedTrip && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-md relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white text-xl transition"
            >✕</button>

            {paymentSubmitted ? (
              /* SUCCESS STATE */
              <div className="text-center py-6">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold mb-2 text-green-400">STK Push Submitted</h2>
                <p className="text-zinc-400 text-sm mb-1">M-Pesa request sent to</p>
                <p className="text-white font-semibold text-lg mb-6">+254 {payPhone}</p>
                <p className="text-zinc-500 text-xs mb-8">Check your phone and enter your M-Pesa PIN to complete the payment.</p>
                <button
                  onClick={handleCloseModal}
                  className="w-full bg-green-600 hover:bg-green-700 py-3.5 rounded-2xl font-semibold transition"
                >
                  Done
                </button>
              </div>
            ) : (
              /* PAYMENT FORM */
              <>
                <h2 className="text-2xl font-bold mb-1">Confirm Booking</h2>
                <p className="text-zinc-400 text-sm mb-6">Pay via M-Pesa to confirm your spot</p>

                <div className="bg-zinc-800 rounded-2xl p-5 mb-6">
                  <div className="font-semibold text-lg">{selectedTrip.title}</div>
                  <div className="text-zinc-400 text-sm mt-1">📍 {selectedTrip.destination}</div>
                  <div className="text-blue-400 font-bold text-xl mt-3">KES {selectedTrip.budget?.toLocaleString()}</div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm text-zinc-400 mb-2">M-Pesa Phone Number</label>
                  <div className="flex gap-2">
                    <div className="bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-white flex items-center gap-2 whitespace-nowrap select-none">
                      🇰🇪 +254
                    </div>
                    <input
                      type="tel"
                      placeholder="000000000"
                      value={payPhone}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 9)
                        setPayPhone(val)
                      }}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-green-600 transition"
                    />
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">{payPhone.length}/9 digits entered</p>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={paying}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed py-3.5 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
                >
                  {paying ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                      Processing M-Pesa...
                    </>
                  ) : (
                    '💚 Pay Now'
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;