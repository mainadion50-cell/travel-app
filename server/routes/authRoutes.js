const express = require('express');
const router = express.Router();
const { registerUser, loginUser, adminLogin } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);           // Regular user login
router.post('/admin/login', adminLogin);    // Dedicated admin login

module.exports = router;