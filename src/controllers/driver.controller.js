const Driver = require('../models/Driver.model');
require('dotenv').config();

const toggleDriverStatus = async (req, res) => {
  try {
    const { driverId } = req.params; // Lấy driverId từ params
    const { status } = req.body; // Lấy status từ body (true hoặc false)

    // Tìm driver dựa trên driverId (chuỗi)
    const driver = await Driver.findOne({ driverId });

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Cập nhật driverStatus theo giá trị status từ client
    driver.driverStatus = status;

    await driver.save();
    return res.status(200).json({
      message: 'Driver status updated',
      driverStatus: driver.driverStatus,  // Trả về trạng thái mới của driver
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { toggleDriverStatus };
