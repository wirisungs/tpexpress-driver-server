const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const { json } = require('body-parser');
require('dotenv').config();

// Middleware for authentication and decoding the JWT token
const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Extracts user info (e.g., driverId)
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Route to get the user profile
const getUserProfile = async (req, res) => {
  try {
    const { driverId } = req.user; // Assuming driverId is part of the JWT token's payload
    const user = await User.findOne({ driverId: driverId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user); // Send the user profile data
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { authenticateUser, getUserProfile };
