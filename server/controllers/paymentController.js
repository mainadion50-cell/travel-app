const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

const simulateMpesaPayment = async (req, res) => {
  const { bookingId, phone, amount } = req.body;

  // Fake delay to simulate M-Pesa STK Push
  await new Promise(resolve => setTimeout(resolve, 2500));

  // Simulate success (80% chance) or failure
  const isSuccess = Math.random() > 0.2;
  const fakeReceipt = isSuccess ? `MPESA${Date.now()}` : null;

  const payment = await Payment.create({
    booking: bookingId,
    user: req.user._id,
    amount,
    phone,
    mpesaReceiptNumber: fakeReceipt,
    status: isSuccess ? 'success' : 'failed',
    paymentDate: isSuccess ? new Date() : null,
  });

  if (isSuccess) {
    await Booking.findByIdAndUpdate(bookingId, { status: 'confirmed' });
  }

  res.status(200).json({
    success: isSuccess,
    message: isSuccess 
      ? 'Payment successful! Receipt: ' + fakeReceipt 
      : 'Payment failed. Please try again.',
    payment,
  });
};

const getPayments = async (req, res) => {
  const payments = await Payment.find({ user: req.user._id })
    .populate('booking')
    .sort({ createdAt: -1 });
  res.json(payments);
};

module.exports = { simulateMpesaPayment, getPayments };