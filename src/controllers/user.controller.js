const bcrypt = require("bcryptjs/dist/bcrypt");
const { json } = require("express");

const editUserProfile = (req, res) => {
  const { username } = req.user;
  const { newUsername, newPassword } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  if (newUsername) {
    user.username = newUsername;
  }
  if (newPassword) {
    user.password = bcrypt.hashSync(newPassword, 10);
  }
  res.status(200).json({ message: 'Profile updated successfully', user });
};

module.exports = { editUserProfile };