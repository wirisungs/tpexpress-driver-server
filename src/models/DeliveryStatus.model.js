const mongoose = require('mongoose');

// Định nghĩa schema cho DeliveryStatus
const statusSchema = new mongoose.Schema(
  {
    statusId: { type: String, required: true, unique: true },
    statusName: { type: String, required: true },
  },
  { collection: 'DeliveryStatus' } // Đảm bảo dùng đúng collection trong MongoDB
);

// Tạo model từ schema
const DeliveryStatus = mongoose.model('DeliveryStatus', statusSchema);

// Xuất model bằng module.exports
module.exports = DeliveryStatus;
