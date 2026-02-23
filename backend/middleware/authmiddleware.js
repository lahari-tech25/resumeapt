// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_secret';
const TOKEN_NAME = 'resumeapt_token';

const verifyToken = (req, res, next) => {
  try {
    // ✅ Read token from cookie (not Authorization header)
    const token = req.cookies[TOKEN_NAME];
    
    if (!token) {
      return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ message: 'Invalid Token' });
  }
};

module.exports = verifyToken;
