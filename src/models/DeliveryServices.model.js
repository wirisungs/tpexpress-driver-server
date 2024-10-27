const mongoose = require('mongoose');

// Define schema for DeliveryServices
const DeliveryServicesSchema = new mongoose.Schema({
  Service_ID: { type: String, required: true, unique: true },
  Service_Name: { type: String, required: true },
  Service_Price: { type: Number, required: true },
}, { collection: 'DeliveryServices' });

module.exports = mongoose.model('DeliveryServices', DeliveryServicesSchema);
