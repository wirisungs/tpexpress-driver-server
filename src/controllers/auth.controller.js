const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const Driver = require('../models/Driver.model');
const Role = require('../models/Role.model');
const Vehicle = require('../models/Vehicle.model');
const VehicleType = require('../models/VehicleType.model');
const LicenseType = require('../models/LicenseType.model');
require('dotenv').config();

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

const generateLicenseTypeId = async (type) => {
  const prefix = type === 'TR' ? 'TR' : 'MT';
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

// Register a new user
const registerUser = async (req, res) => {
    const {
        name, phone, password, vehicleTypeId, vehicleBrand, vehiclePlate, vehicleManufacture, vehicleColor,
        vehicleDisplacement, dob, CCCD, CCCDDate, nationality, bankName, bankAccount, bankNumber,
        location, role, gender, email, address, licenseTypeName
    } = req.body;

    if (!name || !phone || !password || !vehicleTypeId || !vehiclePlate || !dob ||
        !CCCD || !CCCDDate || !bankName || !bankAccount || !bankNumber || !location || !role || !gender || !email || !address || !licenseTypeName) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate password
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,30}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message: 'Password must be 8-30 characters long, contain at least one uppercase letter, one special character, and one number.'
        });
    }

    try {
        // Check if the phone number already exists
        const existingUser = await User.findOne({ userPhone: phone });
        if (existingUser) {
            return res.status(400).json({ message: 'Phone number already registered' });
        }

        const driverId = await generateDriverId();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Validate vehicle type
        const vehicleType = await VehicleType.findOne({ vehicleTypeId });
        if (!vehicleType) {
            return res.status(400).json({ message: 'Invalid vehicle type provided' });
        }

        // Generate license type and ID
        const licenseTypeId = await generateLicenseTypeId(licenseTypeName);

        console.log(`Generated licenseTypeId: ${licenseTypeId}`); // Debugging line

        // Create a new LicenseType entry for the user
        const newLicenseType = new LicenseType({
            licenseTypeId,
            licenseTypeName,  // Name of the license (e.g., A1, B2)
            vehicleTypeID: vehicleTypeId  // Correctly assign the vehicle type ID here
        });

        await newLicenseType.save();

        // Find or create role
        const userRole = await Role.findOne({ roleId: role });
        if (!userRole) {
            return res.status(400).json({ message: 'Invalid role provided' });
        }

        // Create new user
        const newUser = new User({
            userId: driverId,
            userPhone: phone,
            userPassword: hashedPassword,
            userStatus: 'active', // Assuming status is active upon registration
            userRole: userRole.roleId // Store the role ID from the Role model
        });

        await newUser.save();

        // Create a Driver document if the role is 'Driver'
        if (role === 'Driver') {
            const newDriver = new Driver({
                driverId,
                driverName: name,
                driverEmail: email,
                driverPhone: phone,
                driverAddress: address,
                driverBirth: dob,
                driverGender: gender,
                driverCCCD: CCCD,
                driverCCCDDate: CCCDDate,
                driverNationality: nationality,
                driverLicenseId: licenseTypeId,  // Use string for license ID
                driverLicenseType: licenseTypeName,  // Set license type name from input
                driverVehicleBSX: vehiclePlate,
                driverStatus: false, // Assuming true means logged in or available
                driverViolation: 0, // Default 0 violations
                userId: newUser._id
            });

            await newDriver.save();
        }

        // Create a Vehicle document for the user
        const newVehicle = new Vehicle({
            vehicleLicenseBSX: vehiclePlate,
            vehicleTypeId: vehicleTypeId,
            vehicleBrand,
            vehicleManufacture,
            vehicleColor,
            vehicleDisplacement
        });
        await newVehicle.save();

        res.status(201).json({ message: 'User registered successfully', userId: newUser.userId });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
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

    const token = jwt.sign(
      { userId: user._id, userId: user.userId, role: user.userRole },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

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
