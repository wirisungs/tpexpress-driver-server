const Driver = require('../models/Driver.model');
require('dotenv').config();

const toggleDriverStatus = async (req, res) => {
  try {
    const { driverId } = req.params; // Extract driverId từ params
    // Tìm driver dựa trên driverId thay vì _id
    const driver = await Driver.findOne({ driverId }); // Sử dụng driverId (chuỗi) để tìm kiếm driver

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Toggle trạng thái driver
    driver.driverStatus = !driver.driverStatus;

    await driver.save();
    return res.status(200).json({
      message: 'Driver status updated',
      driverStatus: driver.driverStatus  // Trả về trạng thái mới của driver
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { toggleDriverStatus };
