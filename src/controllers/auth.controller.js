const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
require('dotenv').config();

// Generate unique driverId
const generateDriverId = async () => {
  const prefix = "DRV";
  let isUnique = false;
  let driverId = "";

  while (!isUnique) {
    const random = Math.floor(1000 + Math.random() * 9000);
    driverId = `${prefix}${random}`;
    const existingUser = await User.findOne({ driverId });
    if (!existingUser) {
      isUnique = true;
    }
  }
  return driverId;
};

// Register a new user
const registerUser = async (req, res) => {
  const { name, phone, password, vehicle, location } = req.body;

  // Validate password
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,30}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: 'Password must be 8-30 characters long, contain at least one uppercase letter, and one special character.' });
  }

  try {
    // Check if phone number already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    const driverId = await generateDriverId();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      driverId,
      name,
      phone,
      password: hashedPassword,
      vehicle,
      location
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', userId: newUser.driverId });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { phone, password } = req.body;
  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ driverId: user.driverId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = { registerUser, loginUser, authenticateUser };
