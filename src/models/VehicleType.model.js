const mongoose = require('mongoose');

const VehicleTypeSchema = new mongoose.Schema({
  vehicleTypeId: {
    type: String,
    required: true,
    enum: ['Motorcycle', 'Motorbike', 'Truck', 'Car']
  },
  vehicleTypeName: {
    type: String,
    required: true,
    enum: ['Xe gắn máy', 'Xe mô tô', 'Xe tải', 'Xe oto']
  },
}, { collection: 'VehicleType' });

module.exports = mongoose.model('VehicleType', VehicleTypeSchema);
