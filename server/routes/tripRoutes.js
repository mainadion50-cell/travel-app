const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getTrips, createTrip, deleteTrip } = require('../controllers/tripController');

router.get('/', protect, getTrips);
router.post('/', protect, createTrip);
router.delete('/:id', protect, deleteTrip);

module.exports = router;