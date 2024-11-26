const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  driverId: { //mã tài xế
    type: String,
  },
  driverName: { //tên
    type: String,
  },
  driverEmail: { //email
    type: String,
  },
  driverPhone: { //số điện thoại
    type: String,
  },
  driverAddress: { //địa chỉ
    type: String,
    default: null
  },
  driverBirth:{ //ngày sinh
    type: Date,
    default: null
  },
  driverGender: { //giới tính (0: Nam, 1: Nữ)
    type: Number,
    enum: [0, 1]
  },
  driverCCCD: { //số CCCD
    type: String,
    unique: true,
    default: null
  },
  driverCCCDDate: { //ngày cấp
    type: Date,
    default: null
  },
  driverNationality: { //quốc tịch
    type: String,
    default: "Việt Nam"
  },
  driverLicenseId: { //bằng lái xe
    type: String,
    ref: 'LicenseType',
    default: null
  },
  driverLicenseType: { //loại bằng lái
    type: String,
    ref: 'LicenseType', // Referencing the LicenseType model
    default: null
  },
  driverVehicleBSX: { //biển số xe
    type: String,
    default: null
  },
  driverStatus: { //trạng thái hoạt động của tài xế
    type: Boolean,
    default: false,
  },
  driverViolation: { //vi phạm
    type: Number,
    default: 0
  },
  // userId: { //mã người dùng
  //   type: String,
  //   ref: 'User',
  //   required: true
  // }
}, { collection: 'Driver' });

module.exports = mongoose.model('Driver', DriverSchema);
