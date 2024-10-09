const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  customerId: {
    type: String,
    required: true
  },
  driverId: {
    type: String,
    required: false,
    default: null
  },
  item: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'Pending'
  },
  pickupLocation: {
    type: String,
    required: true
  },
  dropoffLocation: {
    type: String,
    required: true
  }
}, { collection: 'Order' });

module.exports = mongoose.model('Order', OrderSchema);