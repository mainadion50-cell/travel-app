const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/bookings
router.post('/', protect, createBooking);

// GET /api/bookings/my
router.get('/my', protect, getMyBookings);

module.exports = router;