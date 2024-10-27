const Driver = require('../models/Driver.model');
require('dotenv').config();

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

module.exports = { toggleDriverStatus };
