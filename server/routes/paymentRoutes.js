const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { simulateMpesaPayment, getPayments } = require('../controllers/paymentController');

const router = express.Router();

// Both routes point to same controller — /simulate used by Dashboard, /mpesa is the original
router.post('/simulate', protect, simulateMpesaPayment);
router.post('/mpesa', protect, simulateMpesaPayment);
router.get('/', protect, getPayments);

module.exports = router;