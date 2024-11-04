const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const Driver = require('../models/Driver.model');
const Role = require('../models/Role.model');
const Vehicle = require('../models/Vehicle.model');
const VehicleType = require('../models/VehicleType.model');
const LicenseType = require('../models/LicenseType.model');
const mongoose = require('mongoose');
require('dotenv').config();


//Genearte unique user ID
const generateUserId = async () => {
    const prefix = "ND";
    let isUnique = false;
    let userId = "";

    while (!isUnique) {
        const random = Math.floor(10000000 + Math.random() * 90000000);
        userId = `${prefix}${random}`;
        const existingUser = await User.findOne({ userId });
        if(!existingUser) {
          isUnique = true;
        }
    }

    return userId;
  };

// Generate a unique driver ID
const generateDriverId = async () => {
    const prefix = "TX";
    let isUnique = false;
    let driverId = "";

    while (!isUnique) {
        const random = Math.floor(10000000 + Math.random() * 90000000);
        driverId = `${prefix}${random}`;
        const existingUser = await User.findOne({ driverId });
        if (!existingUser) {
            isUnique = true;
        }
    }

    return driverId;
};

const generateLicenseTypeId = async (vehicleTypeId) => {
  const prefix = (vehicleTypeId === 'Car' || vehicleTypeId === 'Truck') ? 'TR' : 'MT';
  let isUnique = false;
  let licenseTypeId = "";

  while (!isUnique) {
    const random = Math.floor(1000 + Math.random() * 9000);
    licenseTypeId = `${prefix}${random}`;
    const existingLicenseType = await LicenseType.findOne({ licenseTypeId });
    if (!existingLicenseType) {
      isUnique = true;
    }
  }
  return licenseTypeId;
};

// Register user
const registerUser = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const { name, phone, password, email } = req.body;

    if (!name || !phone || !password || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,30}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message: 'Password must be 8-30 characters long, contain at least one uppercase letter, one special character, and one number.'
        });
    }

    try {
        const existingUser = await User.findOne({ userPhone: phone }).session(session);
        if (existingUser) {
            return res.status(400).json({ message: 'Phone number already registered' });
        }

        const userId = await generateUserId();
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            userId,
            userPhone: phone,
            userPassword: hashedPassword,
            userStatus: 'active',
            userRole: 'Driver',
            userEmail: email
        });
        await newUser.save({ session });

        const newDriver = new Driver({
            driverId: await generateDriverId(),
            userId: newUser.userId,
            driverName: name,
            driverPhone: phone,
            driverEmail: email,
            driverStatus: false
        });
        await newDriver.save({ session });

        await session.commitTransaction();
        res.status(201).json({ message: 'User registered successfully', userId: newUser.userId });
    } catch (error) {
        console.error('Error registering user:', error);
        await session.abortTransaction();
        res.status(500).json({ message: 'Error registering user', error: error.message });
    } finally {
        session.endSession();
    }
};

// Login user
const loginUser = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ userPhone: phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.userPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user.userId, role: user.userRole }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Middleware to authenticate user
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

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.user; // Assuming userId is part of the JWT token's payload
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user); // Send the user profile data
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser, authenticateUser, authorizeRole, getUserProfile };
