const Trip = require('../models/Trip');

// GET all available trips (for logged-in users)
const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ status: { $ne: 'cancelled' } })
      .sort({ departureTime: 1 }) // Sort by departure time
      .lean(); // Better performance for read-only

    res.status(200).json({
      success: true,
      count: trips.length,
      data: trips,
    });
  } catch (err) {
    console.error('Get trips error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trips. Please try again.',
    });
  }
};

// POST create trip (used by admin)
const createTrip = async (req, res) => {
  try {
    const trip = await Trip.create({
      ...req.body,
      organizer: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: trip,
    });
  } catch (err) {
    console.error('Create trip error:', err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// DELETE trip (used by admin)
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Trip deleted successfully',
    });
  } catch (err) {
    console.error('Delete trip error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to delete trip' });
  }
};

module.exports = { getTrips, createTrip, deleteTrip };