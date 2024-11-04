const mongoose = require('mongoose');

// Định nghĩa schema cho DeliveryStatus
const statusSchema = new mongoose.Schema(
    {
        Pay_ID: { type: String, required: true, unique: true },
        Pay_Name: { type: String, required: true },
    },
    { collection: 'PaymentMethod' } // Đảm bảo dùng đúng collection trong MongoDB
);

// Tạo model từ schema
const PaymentMethod = mongoose.model('PaymentMethod', statusSchema);

// Xuất model bằng module.exports
module.exports = PaymentMethod;
