const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled'], 
    default: 'pending' 
  },
  amount: { type: Number, required: true },
  bookingDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);