const Driver = require('../models/Driver.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

const toggleDriverStatus = async (req, res) => {
  const { driverId } = req.body;
  try {
    // Simulating a status toggle. Replace with your actual logic.
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    driver.isWorking = !driver.isWorking; // Example toggle logic
    await driver.save();

    return res.json({ message: 'Driver status updated successfully' });
  } catch (error) {
    console.error('Error updating driver status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { authenticateToken, toggleDriverStatus };
