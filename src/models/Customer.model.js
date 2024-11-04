const mongoose = require('mongoose');

// Define schema for Customer
const CustomerSchema = new mongoose.Schema({
  cusName: {
    type: String,
    required: true
  },
  cusEmail: {
    type: String,
    required: true
  },
  cusPhone: {
    type: String,
    required: true
  },
  cusAddress: {
    type: String,
    required: true
  },
  cusBirhday: {
    type: Date,
    required: true
  },
  cusGender: {
    type: Number,
    required: true,
    enum: [0, 1] // 0 for male, 1 for female
  },
  cusId: {
    type: String,
    required: true,
    unique: true
  },
}, { collection: 'Customer' });

module.exports = mongoose.model('Customer', CustomerSchema);
