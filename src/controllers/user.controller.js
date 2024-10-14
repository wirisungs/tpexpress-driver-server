const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

const getUserProfile = (req, res) => {
  const { driverId } = req.user; // Assuming you're using driverId for user identification

  User.findOne({ driverId: driverId }, (err, user) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  });
}

const editUserProfile = (req, res) => {
  const { driverId } = req.user; // Assuming you're using driverId for user identification
  const { newName, newPhone, newPassword, newVehicle, newLocation } = req.body;

  User.findOne({ driverId: driverId }, (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields if provided
    if (newName) {
      user.name = newName;
    }
    if (newPhone) {
      user.phone = newPhone;
    }
    if (newPassword) {
      user.pass = bcrypt.hashSync(newPassword, 10);
    }
    if (newVehicle) {
      user.vehicle = newVehicle;
    }
    if (newLocation) {
      user.location = newLocation;
    }

    // Save the updated user details
    user.save((err) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating profile' });
      }
      res.status(200).json({ message: 'Profile updated successfully', user });
    });
  });
};

module.exports = { getUserProfile, editUserProfile };
