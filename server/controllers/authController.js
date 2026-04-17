const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// Regular user login (unchanged)
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// NEW: Dedicated Admin Login (Supports plain text for testing)
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  console.log('🔐 Admin Login Attempt:');
  console.log('   Email:', email);
  console.log('   Entered Password:', password ? '***' : 'empty');

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email });

  if (!user) {
    console.log('❌ User not found');
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  console.log('   User found - Role:', user.role);
  console.log('   Stored Password Type:', user.password.startsWith('$2') ? 'Hashed (bcrypt)' : 'Plain Text');

  let isMatch = false;

  // Try bcrypt first (normal case)
  if (user.password.startsWith('$2')) {
    isMatch = await bcrypt.compare(password, user.password);
  } 
  // Fallback for plain text (for testing when you set "admin" in DB)
  else {
    isMatch = (password === user.password);
    console.log('   Using plain text comparison');
  }

  if (isMatch) {
    console.log('✅ Login Successful for', user.email);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    console.log('❌ Password does not match');
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

module.exports = { 
  registerUser, 
  loginUser,
  adminLogin   // ← Added
};