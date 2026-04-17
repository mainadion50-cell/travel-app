const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// ====================== MIDDLEWARE ======================
app.use(helmet());

// Improved CORS configuration - This should fix your login issue
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://travel-2k1siw8cd-mainadion50-7869s-projects.vercel.app', // current one from screenshot
      'https://travel-app-chi-eosin.vercel.app',                       // previous deployment
      // Add any new Vercel preview URLs here when they appear
    ];

    // Allow requests with no origin (like Postman, curl, mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`Blocked origin: ${origin}`); // Helpful for debugging
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ====================== ROUTES ======================
app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/trips',    require('./routes/tripRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/admin',    require('./routes/adminRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '✅ TravelGroup Backend is running successfully!'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// ====================== START SERVER ======================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Allowed origins configured successfully`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
