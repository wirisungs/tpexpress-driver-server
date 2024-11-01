const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const Driver = require('../models/Driver.model');
const Role = require('../models/Role.model');
const Vehicle = require('../models/Vehicle.model');
const VehicleType = require('../models/VehicleType.model');
const LicenseType = require('../models/LicenseType.model');
const OTP = require('../models/OTP.model');
const mongoose = require('mongoose');
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN); // Twilo client
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
    const session = await mongoose.startSession();
    session.startTransaction();

    const {
        name, phone, password, vehicleTypeId, vehicleBrand, vehiclePlate, vehicleManufacture, vehicleColor,
        vehicleDisplacement, dob, CCCD, CCCDDate, nationality, bankName, bankAccount, bankNumber,
        location, role, gender, email, address, licenseTypeName
    } = req.body;

    if (!name || !phone || !password || !vehicleTypeId || !vehiclePlate || !dob ||
        !CCCD || !CCCDDate || !bankName || !bankAccount || !bankNumber || !location || !role || gender === undefined || !email || !address || !licenseTypeName) {
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

        const existingCCCD = await Driver.findOne({ driverCCCD: CCCD }).session(session);
        if (existingCCCD) {
            return res.status(400).json({ message: 'CCCD already registered' });
        }

        const driverId = await generateDriverId();
        const licenseTypeId = await generateLicenseTypeId(vehicleTypeId);

        const existingDriverLicenseId = await Driver.findOne({ driverLicenseId: licenseTypeId }).session(session);
        if (existingDriverLicenseId) {
            return res.status(400).json({ message: 'License ID already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const vehicleType = await VehicleType.findOne({ vehicleTypeId }).session(session);
        if (!vehicleType) {
            return res.status(400).json({ message: 'Invalid vehicle type provided' });
        }

        const newLicenseType = new LicenseType({
            licenseTypeId,
            licenseTypeName,
            vehicleTypeID: vehicleTypeId
        });
        await newLicenseType.save({ session });

        const userRole = await Role.findOne({ roleId: role }).session(session);
        if (!userRole) {
            return res.status(400).json({ message: 'Invalid role provided' });
        }

        const newUser = new User({
            userId: driverId,
            userPhone: phone,
            userPassword: hashedPassword,
            userStatus: 'active',
            userRole: userRole.roleId,
            userVerify: false,
        });
        await newUser.save({ session });

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
                driverLicenseId: licenseTypeId,
                driverLicenseType: licenseTypeName,
                driverVehicleBSX: vehiclePlate,
                driverStatus: false,
                driverViolation: 0,
                userId: newUser.userId
            });
            await newDriver.save({ session });
        }

        const newVehicle = new Vehicle({
            vehicleLicenseBSX: vehiclePlate,
            vehicleTypeId,
            vehicleBrand,
            vehicleManufacture,
            vehicleColor,
            vehicleDisplacement
        });
        await newVehicle.save({ session });

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

const formatPhoneNumber = (userPhone) => {
    return `+84${userPhone.slice(1)}`;
}

//Send OTP via Phone number
const sendOtp = async (userPhone) => {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationTime = new Date(Date.now() + process.env.OTP_EXPIRATION_MINUTES * 60000);

    // Store OTP in the database
    await OTP.create({ userPhone, otpCode, expiresAt: expirationTime });

    // Send OTP via SMS
    await client.messages.create({
      body: `Mã OTP của bạn là ${otpCode}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: userPhone,
    });
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

    // Send OTP
    await sendOtp(phone);
    res.status(200).json({ message: 'OTP sent to your phone number' });
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
