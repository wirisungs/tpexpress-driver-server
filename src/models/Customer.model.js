const mongoose = require('mongoose');

// Define schema for Customer
const CustomerSchema = new mongoose.Schema({
  cus_Name: {
    type: String,
    required: true
  },
  cus_Email: {
    type: String,
    required: true
  },
  cus_Phone: {
    type: String,
    required: true
  },
  cus_Address: {
    type: String,
    required: true
  },
  cus_Birhday: {
    type: Date,
    required: true
  },
  cus_Gender: {
    type: Number,
    required: true,
    enum: [0, 1] // 0 for male, 1 for female
  },
  cus_ID: {
    type: String,
    required: true,
    unique: true
  },
}, { collection: 'Customer' });

module.exports = mongoose.model('Customer', CustomerSchema);
