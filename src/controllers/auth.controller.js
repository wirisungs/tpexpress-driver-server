const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const Driver = require('../models/Driver.model');
const Role = require('../models/Role.model');
const Vehicle = require('../models/Vehicle.model');
const VehicleType = require('../models/VehicleType.model');
const LicenseType = require('../models/LicenseType.model');
const mongoose = require('mongoose');
const twilio = require('twilio');
require('dotenv').config();

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

const sendOtp = async (userPhone) => {
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expirationTime = new Date(Date.now() + process.env.OTP_EXPIRATION_MINUTES * 60000);

  // Store OTP in the database
  await OTP.create({ userPhone, otpCode: otpCode, expiresAt: expirationTime });

  // Send OTP via SMS
  await client.messages.create({
    body: `Your OTP code is ${otpCode}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: userPhone,
  });
};

// Register user OTP
const registerUserOTP = async (req, res) => {
  const { userPhone } = req.body;

  let user = await User.findOne({ userPhone });
  if (!user) {
    user = await User.create({ userPhone });
  }

  await sendOtp(userPhone);
  res.status(200).json({ message: 'OTP sent successfully' });
};

// Register user
const registerUser = async (req, res) => {
  const session = await mongoose.startSession(); // Start a session
  session.startTransaction(); // Begin the transaction

  const {
      name, phone, password, vehicleTypeId, vehicleBrand, vehiclePlate, vehicleManufacture, vehicleColor,
      vehicleDisplacement, dob, CCCD, CCCDDate, nationality, bankName, bankAccount, bankNumber,
      location, role, gender, email, address, licenseTypeName
  } = req.body;

  // Validate mandatory fields
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
      const existingUser = await User.findOne({ userPhone: phone }).session(session);
      if (existingUser) {
          return res.status(400).json({ message: 'Phone number already registered' });
      }

      // Check if the CCCD (citizenship card number) is already registered
      const existingCCCD = await Driver.findOne({ driverCCCD: CCCD }).session(session);
      if (existingCCCD) {
          return res.status(400).json({ message: 'CCCD already registered' });
      }

      // Generate driver ID and license type ID
      const driverId = await generateDriverId();
      const licenseTypeId = await generateLicenseTypeId(vehicleTypeId);

      // Check if the generated license type ID is already registered
      const existingDriverLicenseId = await Driver.findOne({ driverLicenseId: licenseTypeId }).session(session);
      if (existingDriverLicenseId) {
          return res.status(400).json({ message: 'License ID already registered' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Validate the vehicle type
      const vehicleType = await VehicleType.findOne({ vehicleTypeId }).session(session);
      if (!vehicleType) {
          return res.status(400).json({ message: 'Invalid vehicle type provided' });
      }

      // Create a new LicenseType entry
      const newLicenseType = new LicenseType({
          licenseTypeId,
          licenseTypeName, // Name of the license (e.g., A1, B2)
          vehicleTypeID: vehicleTypeId // Link to the vehicle type
      });
      await newLicenseType.save({ session }); // Save with session

      // Find or create role
      const userRole = await Role.findOne({ roleId: role }).session(session);
      if (!userRole) {
          return res.status(400).json({ message: 'Invalid role provided' });
      }

      // Create new user
      const newUser = new User({
          userId: driverId,
          userPhone: phone,
          userPassword: hashedPassword,
          userStatus: 'active', // Assuming status is active upon registration
          userRole: userRole.roleId, // Store the role ID from the Role model
          userVerify: false,
      });
      await newUser.save({ session }); // Save with session

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
              driverLicenseId: licenseTypeId,  // Use the generated license ID
              driverLicenseType: licenseTypeName,  // License type name from input
              driverVehicleBSX: vehiclePlate, // Vehicle license plate (biển số xe)
              driverStatus: false, // Default status to false (not logged in)
              driverViolation: 0, // Default 0 violations
              userId: newUser.userId // Link to the User document
          });
          await newDriver.save({ session }); // Save with session
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
      await newVehicle.save({ session }); // Save with session

      // Commit the transaction if all operations succeeded
      await session.commitTransaction();
      res.status(201).json({ message: 'User registered successfully', userId: newUser.userId });
  } catch (error) {
      console.error('Error registering user:', error);
      await session.abortTransaction(); // Rollback the transaction on error
      res.status(500).json({ message: 'Error registering user', error: error.message });
  } finally {
      session.endSession(); // End the session
  }
};

// Login user
const loginUser = async (req, res) => {
  const { phone, password, otpCode } = req.body;

  try {
    const user = await User.findOne({ userPhone: phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.userPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({ userPhone: phone, otpCode });
    if (!otpRecord) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    // Check if OTP is expired
    if (otpRecord.expiresAt < new Date()) {
      return res.status(401).json({ message: 'OTP expired' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, userId: user.userId, role: user.userRole },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
    console.log('Login successful', token);
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

module.exports = { registerUser, loginUser, authenticateUser, authorizeRole, getUserProfile, registerUserOTP };
