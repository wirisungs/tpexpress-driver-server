const { json } = require('body-parser');
const Order = require('../models/Order.model');
const OrderDetail = require('../models/OrderDetail.model');
const Customer = require('../models/Customer.model');
const DeliveryStatus = require('../models/DeliveryStatus.model');
const User = require('../models/User.model');

//create order
const createOrder = async (req, res) => {
  const { Customer_ID, Order_Date, Order_Address, Order_Phone, Order_Note, Order_Total, Order_Status, Order_Payment } = req.body;
  try {
    const order = new Order({
      Customer_ID,
      Order_Date,
      Order_Address,
      Order_Phone,
      Order_Note,
      Order_Total,
      Order_Status,
      Order_Payment,
    });
    await order.save();
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error creating order' });
  }
}


// Get orders with status_ID
const getOrder = async (req, res) => {
  const { status } = req.query;
  try {
    // Lọc đơn hàng theo Status nếu status được cung cấp
    const orders = await Order.find({ Status_ID: 'ST001' });
    res.json(orders);
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
    res.status(500).json({ error: 'Lỗi khi lấy dữ liệu' });
  }
};

// Get orders with status 'Đang vận chuyển' and match driverId by authenticated user
const getOrderOngoing = async (req, res) => {
  const { driverId } = req.user; // Assuming req.user contains the authenticated user's information
  try {
    const orders = await Order.find({ Status_ID: 'ST002', Driver_ID: driverId }).lean();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching ongoing orders:', error);
    res.status(500).json({ error: 'Error fetching ongoing orders' });
  }
};

// Get order details by Order_ID
const getOrderDetails = async (req, res) => {
  const { Order_ID } = req.params;
  try {
    const orderDetails = await OrderDetail.find({ Order_ID }).lean();
    res.json(orderDetails);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: 'Error fetching order details' });
  }
};

// Update order status to 'Đang vận chuyển' or 'Đã hoàn thành'
const acceptOrder = async (req, res) => {
  const { Order_ID } = req.params;
  const { Status_ID } = req.body;
  const { driverId } = req.user; // Assuming req.user contains the authenticated user's information
  try {
    // Check if the provided Status_ID exists
    const statusExists = await DeliveryStatus.exists({ Status_ID });
    if (!statusExists) {
      return res.status(400).json({ error: 'Invalid Status_ID' });
    }

    // Ensure the current status is 'ST001' before updating to 'ST002'
    const order = await Order.findOne({ Order_ID }).lean();
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (order.Status_ID !== 'ST001') {
      return res.status(400).json({ error: 'Order status must be ST001 to update to ST002' });
    }
    const updatedOrder = await Order.findOneAndUpdate({ Order_ID }, { Status_ID, Driver_ID: driverId }, { new: true }).lean();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Error updating order status' });
  }
};

// Update order status to 'Đã hoàn thành'
const completeOrder = async (req, res) => {
  const { Order_ID } = req.params;
  const { Status_ID } = req.body;
  try {
    // Check if the provided Status_ID exists
    const statusExists = await DeliveryStatus.exists({ Status_ID });
    if (!statusExists) {
      return res.status(400).json({ error: 'Invalid Status_ID' });
    }

    // Ensure the current status is 'ST002' before updating to 'ST003'
    const order = await Order.findOne({ Order_ID }).lean();
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (order.Status_ID !== 'ST002') {
      return res.status(400).json({ error: 'Order status must be ST002 to update to ST003' });
    }

    const updatedOrder = await Order.findOneAndUpdate({ Order_ID }, { Status_ID }, { new: true }).lean();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Error updating order status' });
  }
};

//Update status to 'Đã hủy'
const cancelOrder = async (req, res) => {
  const { Order_ID } = req.params;
  const { Status_ID } = req.body;
  try {
    // Check if the provided Status_ID exists
    const statusExists = await DeliveryStatus.exists({ Status_ID });
    if (!statusExists) {
      return res.status(400).json({ error: 'Invalid Status_ID' });
    }

    // Ensure the current status is 'ST001' before updating to 'ST004'
    const order = await Order.findOne({ Order_ID }).lean();
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (order.Status_ID !== 'ST001' || order.Status_ID !== 'ST002') {
      return res.status(400).json({ error: 'Order status must be ST001 to update to ST004' });
    }

    const updatedOrder = await Order.findOneAndUpdate({ Order_ID }, { Status_ID }, { new: true }).lean();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Error updating order status' });
  }
}

module.exports = {
  getOrder,
  getOrderOngoing,
  getOrderDetails,
  acceptOrder,
  completeOrder,
  cancelOrder,
};
