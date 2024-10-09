const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  driverId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  pass: {
    type: String,
    required: true
  },
  vehicle: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'Available'
  }
});

module.exports = mongoose.model('User', UserSchema);