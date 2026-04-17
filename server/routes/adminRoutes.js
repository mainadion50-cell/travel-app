const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const { getAllBookings } = require('../controllers/bookingController');
const Payment = require('../models/Payment');

// Simple admin check middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Admin access only' });
};

// GET /api/admin/users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// GET /api/admin/bookings
router.get('/bookings', protect, adminOnly, getAllBookings);

// GET /api/admin/payments
router.get('/payments', protect, adminOnly, async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email phone')
      .populate('booking')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
});

module.exports = router;