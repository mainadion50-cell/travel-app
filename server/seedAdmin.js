// =============================================
// seedAdmin.js - Seed Admin User
// Run: node seedAdmin.js
// Place this file in: server/
// =============================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existing = await User.findOne({ role: 'admin' });
    if (existing) {
      console.log('⚠️  Admin already exists:', existing.email);
      console.log('   Delete it first if you want to re-seed.');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin', 12);

    const admin = await User.create({
      name: 'Travel',
      email: 'admin@travelgroup.com',
      password: hashedPassword,
      phone: '+254700000000',
      role: 'admin',
    });

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('  Name     :', admin.name);
    console.log('  Email    :', admin.email);
    console.log('  Password : admin   (hashed in DB)');
    console.log('  Role     :', admin.role);
    console.log('');
    console.log('  Login at: /admin  →  use email: admin@travelgroup.com  password: admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Admin seeding failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();