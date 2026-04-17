const Booking = require('../models/Booking');
const Trip = require('../models/Trip');

// POST /api/bookings — user creates a booking
const createBooking = async (req, res) => {
  try {
    const { tripId, amount } = req.body;

    if (!tripId || !amount) {
      return res.status(400).json({ message: 'tripId and amount are required' });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const booking = await Booking.create({
      trip: tripId,
      user: req.user._id,
      amount,
      status: 'pending',
    });

    await booking.populate('trip');

    res.status(201).json(booking);
  } catch (err) {
    console.error('createBooking error:', err);
    res.status(500).json({ message: 'Server error creating booking' });
  }
};

// GET /api/bookings/my — logged-in user's bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('trip')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
};

// GET /api/admin/bookings — admin sees all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('trip')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching all bookings' });
  }
};

module.exports = { createBooking, getMyBookings, getAllBookings };