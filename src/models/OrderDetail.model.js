const mongoose = require('mongoose');

// Định nghĩa schema cho DeliveryStatus
const statusSchema = new mongoose.Schema(
  {
    Item_ID: { type: String, required: true, unique: true },
    Item_Name: { type: String, required: true },
    Item_Weight: { type: Number, required: true },
    Item_AllValue: { type: Number, required: true },
    Order_ID: { type: String, required: true, nique: true },
  },
  { collection: 'OrderDetail' } // Đảm bảo dùng đúng collection trong MongoDB
);

// Tạo model từ schema
const OrderDetail = mongoose.model('OrderDetail', statusSchema);

// Xuất model bằng module.exports
module.exports = OrderDetail;
