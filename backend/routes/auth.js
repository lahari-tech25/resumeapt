import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import verifyToken from '../middleware/authMiddleware.js';
import BuilderResume from '../models/BuilderResume.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_secret';
const TOKEN_NAME = 'resumeapt_token';
const TOKEN_EXPIRES = 1000 * 60 * 60 * 2; // 2 hours in ms

function setTokenCookie(res, token) {
  res.cookie(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: TOKEN_EXPIRES,
    path: "/",
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

    const user = await User.create({ name, email, password: passwordHash });

    const payload = { id: user._id, email: user.email, name: user.name };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });

    setTokenCookie(res, token);

    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { id: user._id, email: user.email, name: user.name };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });

    setTokenCookie(res, token);

    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie(TOKEN_NAME, { httpOnly: true, sameSite: 'lax' });
  res.json({ message: 'Logged out' });
});

// Me - verify cookie
router.get('/me', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

export default router;