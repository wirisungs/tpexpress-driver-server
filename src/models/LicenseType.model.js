const mongoose = require('mongoose');

const LicenseTypeSchema = new mongoose.Schema({
  licenseTypeId: { //mã loại bằng lái
    type: String,
    required: true,
  },
  licenseTypeName: { //tên loại bằng lái
    type: String,
    required: true
  },
  vehicleTypeID: {  //loại xe
    type: String,
    required: true,
    ref: 'VehicleType' // Referencing the VehicleType model
  },
}, { collection: 'LicenseType' });

module.exports = mongoose.model('LicenseType', LicenseTypeSchema);
