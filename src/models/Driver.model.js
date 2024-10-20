const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  driverId: { //mã tài xế
    type: String,
    required: true,
    unique: true
  },
  driverName: { //tên
    type: String,
    required: true
  },
  driverEmail: { //email
    type: String,
    required: true
  },
  driverPhone: { //số điện thoại
    type: String,
    required: true
  },
  driverAddress: { //địa chỉ
    type: String,
    required: true
  },
  driverBirth:{ //ngày sinh
    type: Date,
    required: true
  },
  driverGender: { //giới tính
    type: String,
    required: true
  },
  driverCCCD: { //số CCCD
    type: String,
    required: true,
    unique: true
  },
  driverCCCDDate: { //ngày cấp
    type: Date,
    required: true
  },
  driverNationality: { //quốc tịch
    type: String,
    required: true
  },
  driverLicenseId: { //bằng lái xe
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  driverLicenseType: { //loại bằng lái
    type: String,
    required: true,
    ref: 'LicenseType' // Referencing the LicenseType model
  },
  driverVehicleBSX: { //biển số xe
    type: String,
    required: true
  },
  driverStatus: { //trạng thái đăng nhập
    type: Boolean,
    required: true
  },
  driverViolation: { //vi phạm
    type: Number,
    required: false
  },
  userId: { //mã người dùng
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { collection: 'Driver' });

module.exports = mongoose.model('Driver', DriverSchema);
