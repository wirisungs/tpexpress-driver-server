const { verify } = require('jsonwebtoken');
const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  vehicleLicenseBSX: { //biển số xe
    type: String,
    required: true,
    unique: true,
    ref: 'Driver' // Referencing the Driver model
  },
  vehicleTypeId: { //loại xe
    type: String,
    required: true,
    ref: 'VehicleType', // Referencing the VehicleType model
  },
  vehicleBrand: { //hãng xe
    type: String,
    required: true
  },
  vehicleManufacture: { //năm sản xuất
    type: Date,
    required: true
  },
  vehicleColor: { //màu xe
    type: String,
    required: true
  },
  vehicleDisplacement: { //phân khối
    type: String,
    required: true
  },
}, { collection: 'Vehicle' });

module.exports = mongoose.model('Vehicle', VehicleSchema);
