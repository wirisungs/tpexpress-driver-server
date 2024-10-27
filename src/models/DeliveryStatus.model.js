const mongoose = require('mongoose');

// Define schema for DeliveryStatus
const DeliveryStatusSchema = new mongoose.Schema(
  {
    Status_ID: { type: String, required: true, unique: true },
    Status_Name: { type: String, required: true },
  },
  { collection: 'DeliveryStatus' } // Ensure using the correct collection in MongoDB
);

module.exports = mongoose.model('DeliveryStatus', DeliveryStatusSchema);
