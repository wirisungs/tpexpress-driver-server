const { json } = require('body-parser');
const Order = require('../models/Order.model');
const OrderDetail = require('../models/OrderDetail.model');
const Customer = require('../models/Customer.model');
const DeliveryStatus = require('../models/DeliveryStatus.model');
const User = require('../models/User.model');
const cloudinary = require('../config/cloudinary.config');

// Lấy đơn hàng với trạng thái 'Chờ xử lý'
const getOrder = async (req, res) => {
  try {
    console.log('Đang lấy đơn hàng');
    const orders = await Order.find({ orderStatusId: 'ST001' }).lean();
    res.json(orders);
  } catch (error) {
    console.error('Lỗi khi lấy đơn hàng:', error);
    res.status(500).json({ error: 'Lỗi khi lấy đơn hàng' });
  }
};

// Lấy đơn hàng 'Đang vận chuyển' cho tài xế theo driverId
const getOrderOngoing = async (req, res) => {
  const { driverId } = req.params;
  try {
    const orders = await Order.find({ orderStatusId: 'ST002', driverId }).lean();
    if (!orders.length) {
      return res.status(404).json({ message: 'Không có đơn hàng nào đang vận chuyển' });
    }
    res.json(orders);
  } catch (error) {
    console.error('Lỗi khi lấy đơn hàng đang xử lý:', error);
    res.status(500).json({ error: 'Lỗi khi lấy đơn hàng đang xử lý' });
  }
};

// Lấy chi tiết đơn hàng theo orderId
const getOrderDetails = async (req, res) => {
  const { orderId } = req.params;
  try {
    const orderDetails = await OrderDetail.find({ orderId }).lean();
    res.json(orderDetails);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
    res.status(500).json({ error: 'Lỗi khi lấy chi tiết đơn hàng' });
  }
};

// Chấp nhận đơn hàng (kiểm tra giới hạn 10 đơn/ngày)
const acceptOrder = async (req, res) => {
  const { orderId } = req.params;
  const { statusId, driverId } = req.body;

  if (!driverId) {
    return res.status(400).json({ error: 'Cần có mã tài xế' });
  }

  try {
    console.log(`Chấp nhận đơn hàng: orderId=${orderId}, driverId=${driverId}`);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Kiểm tra tài xế đã nhận đủ 10 đơn trong ngày chưa
    const ordersToday = await Order.countDocuments({
      driverId,
      createdDate: { $gte: todayStart, $lte: todayEnd },
    });

    if (ordersToday >= 10) {
      return res.status(400).json({ error: 'Tài xế đã nhận đủ 10 đơn trong ngày' });
    }

    // Kiểm tra trạng thái hợp lệ
    const statusExists = await DeliveryStatus.exists({ statusId });
    if (!statusExists) {
      return res.status(40).json({ error: 'Mã trạng thái không hợp lệ' });
    }

    // Kiểm tra đơn hàng
    const order = await Order.findOne({ orderId }).lean();
    if (!order) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    }
    if (order.orderStatusId !== 'ST001') {
      return res.status(400).json({ error: 'Trạng thái đơn hàng phải là ST001 để cập nhật thành ST002' });
    }

    // Cập nhật trạng thái
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { orderStatusId: statusId, driverId },
      { new: true }
    ).lean();

    res.json({ message: 'Đơn hàng đã được chấp nhận', updatedOrder });
  } catch (error) {
    console.error('Lỗi khi chấp nhận đơn hàng:', error);
    res.status(500).json({ error: 'Lỗi khi chấp nhận đơn hàng' });
  }
};

// Hoàn thành đơn hàng
const completeOrder = async (req, res) => {
  const { orderId } = req.params;
  const { statusId, proofImage } = req.body;

  try {
    const order = await Order.findOne({ orderId }).lean();
    if (!order) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    }
    if (order.orderStatusId !== 'ST002') {
      return res.status(400).json({ error: 'Trạng thái đơn hàng phải là ST002 để cập nhật thành ST003' });
    }

    // Upload ảnh nếu có
    let imageUrl = null;
    if (proofImage) {
      const uploadResponse = await cloudinary.uploader.upload(proofImage, {
        folder: 'proof_images',
        public_id: `order_${orderId}_proof`,
      });
      imageUrl = uploadResponse.secure_url;
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { orderStatusId: statusId, proofImage: imageUrl },
      { new: true }
    ).lean();

    res.json({ message: 'Đơn hàng đã hoàn thành', updatedOrder });
  } catch (error) {
    console.error('Lỗi khi hoàn thành đơn hàng:', error);
    res.status(500).json({ error: 'Lỗi khi hoàn thành đơn hàng' });
  }
};

// Hủy đơn hàng
const cancelOrder = async (req, res) => {
    const { orderId } = req.params;
    const { statusId, reason } = req.body;

    try {
      console.log(`Đang hủy đơn hàng: orderId=${orderId}`);

      // Kiểm tra trạng thái hợp lệ
      const statusExists = await DeliveryStatus.exists({ statusId });
      if (!statusExists) {
        return res.status(400).json({ error: 'Mã trạng thái không hợp lệ' });
      }

      // Kiểm tra đơn hàng
      const order = await Order.findOne({ orderId }).lean();
      if (!order) {
        return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
      }
      if (order.orderStatusId === 'ST003' || order.orderStatusId === 'ST004') {
        return res.status(400).json({ error: 'Không thể hủy đơn hàng đã hoàn thành hoặc đã hủy' });
      }

      // Cập nhật trạng thái và lý do hủy
      const updatedOrder = await Order.findOneAndUpdate(
        { orderId },
        { orderStatusId: statusId, cancelReason: reason },
        { new: true }
      ).lean();

      res.json({ message: 'Đơn hàng đã được hủy', updatedOrder });
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng:', error);
      res.status(500).json({ error: 'Lỗi khi hủy đơn hàng' });
    }
  };

// Lấy đơn hàng đã hoàn thành
const getOrderCompleted = async (req, res) => {
    const { driverId } = req.params;

    try {
      console.log('Đang lấy đơn hàng đã hoàn thành cho tài xế:', driverId);

      const completedOrders = await Order.find({ orderStatusId: 'ST003', driverId }).lean();

      if (!completedOrders.length) {
        return res.status(404).json({ message: 'Không có đơn hàng đã hoàn thành' });
      }

      res.json(completedOrders);
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng đã hoàn thành:', error);
      res.status(500).json({ error: 'Lỗi khi lấy đơn hàng đã hoàn thành' });
    }
  };

  // Lấy đơn hàng đã hủy
const getOrderCanceled = async (req, res) => {
    const { driverId } = req.params;

    try {
      console.log('Đang lấy đơn hàng đã hủy cho tài xế:', driverId);

      const canceledOrders = await Order.find({ orderStatusId: 'ST004', driverId }).lean();

      if (!canceledOrders.length) {
        return res.status(404).json({ message: 'Không có đơn hàng đã hủy' });
      }

      res.json(canceledOrders);
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng đã hủy:', error);
      res.status(500).json({ error: 'Lỗi khi lấy đơn hàng đã hủy' });
    }
  };

// Tính doanh thu
const calculateRevenue = async (req, res) => {
    const { driverId } = req.params;

    try {
      const completedOrders = await Order.find({ driverId, orderStatusId: 'ST003' }).lean();
      const failedOrders = await Order.find({ driverId, orderStatusId: 'ST004' }).lean();

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayRevenue = completedOrders
        .filter(order => order.createdDate >= todayStart)
        .reduce((sum, order) => sum + (order.totalPrice || 0), 0);

      const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

      const driverRevenue = (totalRevenue * 30) / 100;
      const companyRevenue = totalRevenue - driverRevenue;

      // Example transactions (populate this from your database in production)
      const transactions = completedOrders.map(order => ({
        date: order.createdDate,
        name: order.customerName || 'Khách hàng không xác định',
        amount: `${order.totalPrice || 0} vnđ`,
        type: 'income',
      }));

      res.json({
        totalRevenue,
        driverRevenue,
        companyRevenue,
        completedOrders: completedOrders.length,
        failedOrders: failedOrders.length,
        todayRevenue,
        transactions,
      });
    } catch (error) {
      console.error('Lỗi khi tính toán doanh thu:', error);
      res.status(500).json({ error: 'Lỗi khi tính toán doanh thu' });
    }
  };



// Export module
module.exports = {
  getOrder,
  getOrderOngoing,
  getOrderDetails,
  acceptOrder,
  completeOrder,
  cancelOrder,
  getOrderCompleted,
  getOrderCanceled,
  calculateRevenue,
};
