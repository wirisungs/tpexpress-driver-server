const Driver = require('../models/Driver.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const toggleDriverStatus = async (req, res) => {
  const { driverId } = req.body;

  if (!driverId) {
      return res.status(400).json({ message: 'Driver ID is required' });
  }

  try {
      // Find the driver by their ID
      const driver = await Driver.findOne({ driverId });

      if (!driver) {
          return res.status(404).json({ message: 'Driver not found' });
      }

      // Toggle the driver's status
      driver.driverStatus = !driver.driverStatus;

      // Save the updated driver status
      await driver.save();

      // Send response with the updated status
      const statusMessage = driver.driverStatus ? 'online' : 'offline';
      res.status(200).json({ message: `Driver is now ${statusMessage}`, driverStatus: driver.driverStatus });
  } catch (error) {
      console.error('Error toggling driver status:', error);
      res.status(500).json({ message: 'Error toggling driver status', error: error.message });
  }
};

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

module.exports = { toggleDriverStatus, authenticateUser };
