const User = require('../models/User.model');
const Driver = require('../models/Driver.model');
const Vehicle = require('../models/Vehicle.model');
const VehicleType = require('../models/VehicleType.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const getDriver = async (req, res) => {
  const { id } = req.params;

  try {
    const status = await Driver.findOne({ driverId: id });

    if (!status) {
      return res.status(404).json({ message: 'Không tìm thấy tài xế' });
    }
    res.json(status);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin tài xế:', error);
    res.status(500).json({ message: 'Lỗi khi lấy thông tin tài xế', error: error.message });
  }
};

const getUserEmail = async (req, res) => {
  const { email } = req.query;

  try {
    const driver = await Driver.findOne({ driverEmail: email });

    if (driver) {
      // Nếu tìm thấy driver, trả về exists và driverId
      return res.json({ exists: true, driverId: driver.driverId });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error('Lỗi khi kiểm tra email:', error);
    res.status(500).json({ error: 'Lỗi khi kiểm tra email' });
  }
};

const saveUserProfileFromSSO = async (req, res) => {
  const { driverId, name, email, phone, address, birth, driverGender } = req.body;
  console.log("Dữ liệu nhận từ frontend:", req.body);

  try {
    const existingDriver = await Driver.findOne({ driverEmail: email });
    console.log("Kiểm tra email tồn tại:", existingDriver);

    if (existingDriver) {
      return res.status(409).json({ error: 'Email đã tồn tại trong hệ thống' });
    }

    const newDriver = new Driver({
      driverId: driverId,
      driverName: name,
      driverEmail: email,
      driverPhone: phone,
      driverAddress: address,
      driverBirthday: birth,
      driverGender: driverGender,
    });
    console.log("Đối tượng mới chuẩn bị lưu:", newDriver);

    await newDriver.save();
    res.status(201).json({ message: 'Tài khoản đã được tạo thành công', Driver: newDriver });
  } catch (error) {
    console.error('Lỗi khi tạo tài khoản be:', error);
    res.status(500).json({ error: 'Lỗi khi tạo tài khoản be2' });
  }
};

const checkDriverEmail = async (req, res) => {
  const { email } = req.query;

  if(!email) {
    return res.json(200).json({ message: 'Email không được để trống' });
  }

  try {
    const driver = await Driver.findOne( { driverEmail: email });
    if(driver) {
      return res.json({ exists: true, driver });
    } else {
      return res.json({ exists: false, message: 'Email không tồn tại trong hệ thống' });
    }
  } catch (error) {
      res.status(500).json({ message: 'Lỗi khi kiểm tra email', error: error.message });
    }
  };

// Route to get the user profile

const fetchUserProfile = async (req, res) => {
  const { driverId } = req.params; // Get driverId from URL params

  try {
    // Fetch driver data from database based on driverId
    const driver = await Driver.findOne({ driverId });

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Return driver profile data
    res.json(driver);
  } catch (err) {
    console.error('Error fetching user profile:', err); // Detailed error logging
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { fetchUserProfile };

// Route to update the user profile
const updateUserProfile = async (req, res) => {
  const { userId } = req.user; // Get userId from authenticated user
  const { name, phone, email, address, vehicleBrand, vehiclePlate, vehicleColor, vehicleDisplacement } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    if (name) user.name = name;
    if (phone) user.userPhone = phone;
    if (email) user.email = email;
    if (address) user.address = address;

    // Save the updated user
    await user.save();

    // If the user is a driver, update the driver profile as well
    if (user.userRole === 'Driver') {
      const driver = await Driver.findOne({ userId });
      if (driver) {
        if (vehicleBrand) driver.vehicleBrand = vehicleBrand;
        if (vehiclePlate) driver.driverVehicleBSX = vehiclePlate;
        if (vehicleColor) driver.vehicleColor = vehicleColor;
        if (vehicleDisplacement) driver.vehicleDisplacement = vehicleDisplacement;

        // Save the updated driver profile
        await driver.save();
      }
    }

    res.status(200).json({ message: 'User profile updated successfully' });
  } catch (err) {
    console.error('Error updating user profile:', err); // Detailed error logging
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { fetchUserProfile, updateUserProfile, getDriver, getUserEmail, saveUserProfileFromSSO, checkDriverEmail };
