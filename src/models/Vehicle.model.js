const { verify } = require('jsonwebtoken');
const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  vehicleLicenseBSX: { //biển số xe
    type: String,
    default: null,
    ref: 'Driver' // Referencing the Driver model
  },
  vehicleTypeId: { //loại xe
    type: String,
    default: null,
    ref: 'VehicleType', // Referencing the VehicleType model
  },
  vehicleBrand: { //hãng xe
    type: String,
    default: null
  },
  vehicleManufacture: { //năm sản xuất
    type: Date,
    default: null
  },
  vehicleColor: { //màu xe
    type: String,
    default: null
  },
  vehicleDisplacement: { //phân khối
    type: String,
    default: null
  },
}, { collection: 'Vehicle' });

module.exports = mongoose.model('Vehicle', VehicleSchema);
