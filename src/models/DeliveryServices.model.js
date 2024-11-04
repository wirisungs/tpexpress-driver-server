const mongoose = require('mongoose');

// Định nghĩa schema cho DeliveryStatus
const statusSchema = new mongoose.Schema(
    {
        Services_ID: { type: String, required: true, unique: true },
        Services_Name: { type: String, required: true },
        Services_Price: { type: Number, required: true },
        Services_Time: { type: String, required: true },
    },
    { collection: 'DeliveryServices' } // Đảm bảo dùng đúng collection trong MongoDB
);

// Tạo model từ schema
const DeliveryServices = mongoose.model('DeliveryServices', statusSchema);

// Xuất model bằng module.exports
module.exports = DeliveryServices;
