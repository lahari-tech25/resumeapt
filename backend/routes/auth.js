// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middleware/authMiddleware');
const BuilderResume = require("../models/BuilderResume");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_secret';
const TOKEN_NAME = 'resumeapt_token';
const TOKEN_EXPIRES = 1000 * 60 * 60 * 2; // 2 hours in ms (cookie maxAge)

// Helper to set cookie
function setTokenCookie(res, token) {
  res.cookie(TOKEN_NAME, token, {
    httpOnly: true,
    secure: false,           
    sameSite: 'lax',
    maxAge: TOKEN_EXPIRES,
    path: '/',
    domain: 'localhost',     // ✅ ADD THIS - allows cookie to work across ports
  });
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // ✅ FIXED: Use 'password' field (not passwordHash)
    const user = await User.create({ name, email, password: passwordHash });

    // create JWT
    const payload = { id: user._id, email: user.email, name: user.name };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });

    setTokenCookie(res, token);

    // Return user safe info (no password)
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
// Login Route - CORRECTED
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('📧 Login attempt for:', email); // Debug
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const user = await User.findOne({ email });
    
    console.log('👤 User found:', user ? 'YES' : 'NO'); // Debug
    console.log('🔐 Password in DB exists:', user ? !!user.password : 'N/A'); // Debug
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // ✅ CRITICAL: Make sure user.password exists
    if (!user.password) {
      console.error('❌ User has no password in database!');
      return res.status(500).json({ message: 'Account error' });
    }

    const match = await bcrypt.compare(password, user.password);
    
    console.log('🔑 Password match:', match); // Debug
    
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = { id: user._id, email: user.email, name: user.name };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });

    // ✅ Set cookie with explicit configuration
    res.cookie(TOKEN_NAME, token, {
      httpOnly: true,
      secure: false,        // false for localhost
      sameSite: 'lax',      
      maxAge: TOKEN_EXPIRES,
      path: '/',
    });
    
    console.log('🍪 Cookie set successfully'); // Debug

    res.json({ 
      success: true,
      user: { id: user._id, name: user.name, email: user.email } 
    });
    
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie(TOKEN_NAME, { httpOnly: true, sameSite: 'lax' });
  res.json({ message: 'Logged out' });
});

// Me - verify cookie and return user
router.get('/me', verifyToken, (req, res) => {
  // authMiddleware sets req.user
  res.json({ user: req.user });
});



module.exports = router;