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
  },
  note: {
    type: String,
    required: false,
    default: null
  },
  price: { //If you want to add a price field to the Order model, you can do so by adding the following field to the OrderSchema:
    type: Number,
    required: false,
    default: null
  }
}, { collection: 'Order' });

module.exports = mongoose.model('Order', OrderSchema);