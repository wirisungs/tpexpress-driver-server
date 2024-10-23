const User = require('../models/User.model');
const Driver = require('../models/Driver.model');
require('dotenv').config();

// Route to get the user profile
const fetchUserProfile = async (req, res) => {
    try {
      const { userId } = req.user;  // Extract userId from the authenticated user
      // Fetch driver profile based on userId (which is a string)
      const driver = await Driver.findOne({ userId })  // Match driver by userId (String)
        .exec(); // Ensure the query is executed

      if (!driver) {
        return res.status(404).json({ message: 'Driver profile not found' });
      }

      // Fetch user details separately using driver.userId (String)
      const user = await User.findOne({ userId: driver.userId }) // Query the User model by userId field
        .select('userPhone userRole'); // Select only needed fields

      // Respond with the driver profile data
      res.json({
        driverName: driver.driverName,
        driverPhone: driver.driverPhone,
        driverLicenseType: driver.driverLicenseType,
        vehiclePlate: driver.driverVehicleBSX,
        driverLocation: driver.driverAddress,
        userRole: user ? user.userRole : null,  // Check if user exists before accessing userRole
      });
    } catch (error) {
      console.error('Error fetching driver profile:', error);  // Log the exact error
      res.status(500).json({ message: 'Server error', error: error.message });
    }
};


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

module.exports = { fetchUserProfile, updateUserProfile };
