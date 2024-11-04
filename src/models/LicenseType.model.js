const mongoose = require('mongoose');

const LicenseTypeSchema = new mongoose.Schema({
  licenseTypeId: { //mã loại bằng lái
    type: String,
    default: null,
  },
  licenseTypeName: { //tên loại bằng lái
    type: String,
    default: null
  },
  vehicleTypeID: {  //loại xe
    type: String,
    default: null,
    ref: 'VehicleType' // Referencing the VehicleType model
  },
}, { collection: 'LicenseType' });

module.exports = mongoose.model('LicenseType', LicenseTypeSchema);
