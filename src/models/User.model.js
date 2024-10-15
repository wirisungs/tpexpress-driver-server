const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  driverId: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    required: true,
    default: 'driver'
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  details: {
    vehicle: {
      type: String,
      required: true
    },
    vehiclePlate: {
      type: String,
      required: true
    },
    licensePlate: {
      type: String,
      required: true
    },
    dob: {
      type: Date,
      required: true
    },
    CCCD: {
      type: String,
      required: true
    },
    bankName: {
      type: String,
      required: true
    },
    bankAccount: {
      type: String,
      required: true
    },
    bankNumber: {
      type: String,
      required: true
    }
  },
  location: {
    type: String,
    required: true
  }
}, { collection: 'User' });

module.exports = mongoose.model('User', UserSchema);