const OrderDetail = require('../models/OrderDetail.model');

const getItem = async (req, res) => {
  const { status } = req.query;
  try {
    const orders = await OrderDetail.find(status ? { Order_ID: status } : {});
    res.json(orders);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết đơn hàng:', error.message);
    res.status(500).json({ error: 'Lỗi khi lấy chi tiết đơn hàng' });
  }
}

module.exports = { getItem };
