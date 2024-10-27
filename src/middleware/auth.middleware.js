const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateUser = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Extracts user info (e.g., userId, role)
    next();
  } catch (err) {
    console.error('Error authenticating user:', err);
    res.status(400).json({ message: 'Invalid token', error: err.message });
  }
};

module.exports = { authenticateUser };
