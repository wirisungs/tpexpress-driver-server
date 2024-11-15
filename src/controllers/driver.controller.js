const Driver = require('../models/Driver.model');
require('dotenv').config();

const toggleDriverStatus = async (req, res) => {
  try {
    const driverId = req.user; // Extract driverId from the authenticated user
    const driver = await Driver.findById(driverId);

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Ensure driverStatus is boolean and toggle it
    driver.driverStatus = !Boolean(driver.driverStatus);

    await driver.save();
    return res.status(200).json({
      message: 'Driver status updated',
      driverStatus: driver.driverStatus  // Return the updated driverStatus
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = { toggleDriverStatus };
