const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true }, // Khóa chính
  cusId: { type: String }, // Không còn required
  senderAddress: { type: String },
  receiverPhone: { type: String },
  receiverName: { type: String },
  receiverAddress: { type: String },
  orderType: { type: String },
  orderIsFragile: { type: Boolean }, // Không còn required
  orderNote: { type: String, default: null }, // Có thể để trống
  orderCOD: { type: Number, default: 0 }, // Mặc định là 0 nếu không có giá trị
  dservicesId: { type: String },
  totalPrice: { type: Number, default: 0 }, // Giá trị mặc định
  paymentId: { type: String, default: null },
  orderStatusId: { type: String },
  driverId: { type: String, default: null },
  createdDate: { type: Date, default: Date.now }, // Mặc định ngày tạo
  deliverPrice: { type: Number, default: 0 },
  proofSuccess: { type: String, default: null },
  reasonFailed: { type: String, default: null }
}, { collection: 'Order' });

// Middleware kiểm tra số đơn của tài xế trước khi lưu
orderSchema.pre('save', async function (next) {
  try {
    if (!this.driverId) return next(); // Nếu chưa có tài xế thì bỏ qua

    // Tính số đơn tài xế đã nhận trong ngày
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const ordersToday = await mongoose.model('Order').countDocuments({
      driverId: this.driverId,
      createdDate: { $gte: todayStart, $lte: todayEnd }
    });

    if (ordersToday >= 10) {
      throw new Error("Tài xế đã nhận đủ 10 đơn trong ngày!");
    }

    next(); // Cho phép lưu đơn nếu chưa đạt giới hạn
  } catch (error) {
    next(error); // Trả lỗi về nếu có lỗi
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
