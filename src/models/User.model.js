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
  password: {
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
}, { collection: 'User' });

module.exports = mongoose.model('User', UserSchema);