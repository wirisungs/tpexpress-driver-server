const { json } = require('body-parser');
const Order = require('../models/Order.model');
const OrderDetail = require('../models/OrderDetail.model');
const Customer = require('../models/Customer.model');
const DeliveryStatus = require('../models/DeliveryStatus.model');
const User = require('../models/User.model');

// Get orders with orderStatusId
const getOrder = async (req, res) => {
  try {
    console.log('Fetching orders');
    const orders = await Order.find({ orderStatusId: 'ST001' }).lean();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
};

// Get orders with status 'Đang vận chuyển' for a driver my driverId
const getOrderOngoing = async (req, res) => {
  const { driverId } = req.user; // Assuming req.user contains the authenticated user's information
  try {
    const orders = await Order.find({ orderStatusId: 'ST002', driverId: driverId }).lean();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching ongoing orders:', error);
    res.status(500).json({ error: 'Error fetching ongoing orders' });
  }
};

// Get order details by orderId
const getOrderDetails = async (req, res) => {
  const { orderId } = req.params;
  try {
    const orderDetails = await OrderDetail.find({ orderId }).lean();
    res.json(orderDetails);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: 'Error fetching order details' });
  }
};

// Update order status to 'Đang vận chuyển'
const acceptOrder = async (req, res) => {
  const { orderId } = req.params;
  const { statusId } = req.body;

  // Log the decoded user to check if driverId is present
  console.log('Decoded user:', req.user);

  const driverId = req.user?.driverId; // Assuming the driverId is stored in the JWT token

  if (!driverId) {
    return res.status(400).json({ error: 'Driver ID is required' });
  }

  try {
    // Log driverId and orderId for debugging
    console.log('Accepting order with orderId:', orderId, 'and driverId:', driverId);

    // Check if the provided statusId exists
    const statusExists = await DeliveryStatus.exists({ statusId });
    if (!statusExists) {
      return res.status(400).json({ error: 'Invalid statusId' });
    }

    // Find the order and verify current status
    const order = await Order.findOne({ orderId }).lean();
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (order.orderStatusId !== 'ST001') {
      return res.status(400).json({ error: 'Order status must be ST001 to update to ST002' });
    }

    // Update order status to 'ST002' and set driverId
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { orderStatusId: statusId, driverId: driverId },
      { new: true }
    ).lean();

    // Send updated order response
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Error updating order status' });
  }
};

// Update order status to 'Đã hoàn thành'
const completeOrder = async (req, res) => {
  const { orderId } = req.params;
  const { statusId } = req.body;
  try {
    // Check if the provided statusId exists
    const statusExists = await DeliveryStatus.exists({ statusId });
    if (!statusExists) {
      return res.status(400).json({ error: 'Invalid statusId' });
    }

    // Ensure the current status is 'ST002' before updating to 'ST003'
    const order = await Order.findOne({ orderId }).lean();
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (order.orderStatusId !== 'ST002') {
      return res.status(400).json({ error: 'Order status must be ST002 to update to ST003' });
    }

    const updatedOrder = await Order.findOneAndUpdate({ orderId }, { orderStatusId: statusId }, { new: true }).lean();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Error updating order status' });
  }
};

// Update status to 'Đã hủy'
const cancelOrder = async (req, res) => {
  const { orderId } = req.params;
  const { statusId } = req.body;
  try {
    // Check if the provided statusId exists
    const statusExists = await DeliveryStatus.exists({ statusId });
    if (!statusExists) {
      return res.status(400).json({ error: 'Invalid statusId' });
    }

    // Ensure the current status is 'ST001' or 'ST002' before updating to 'ST004'
    const order = await Order.findOne({ orderId }).lean();
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (order.orderStatusId !== 'ST001' && order.orderStatusId !== 'ST002') {
      return res.status(400).json({ error: 'Order status must be ST001 or ST002 to update to ST004' });
    }

    const updatedOrder = await Order.findOneAndUpdate({ orderId }, { orderStatusId: statusId }, { new: true }).lean();
    res.json(updatedOrder);
  } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Error updating order status' });
  }
}

const getOrderCompleted = async (req, res) => {
    const { driverId } = req.user; // Assuming req.user contains the authenticated user's information
    try {
        console.log('Fetching completed orders for driver:', driverId);
        const orders = await Order.find({ orderStatusId: 'ST003', driverId: driverId }).lean();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Error fetching orders' });
    }
}

const getOrderCanceled = async (req, res) => {
    const { driverId } = req.user; // Assuming req.user contains the authenticated user's information
    try {
        console.log('Fetching canceled orders for driver:', driverId);
        const orders = await Order.find({ orderStatusId: 'ST004', driverId: driverId }).lean();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching canceled orders:', error);
        res.status(500).json({ error: 'Error fetching canceled orders' });
    }
}

module.exports = {
  getOrder,
  getOrderOngoing,
  getOrderDetails,
  acceptOrder,
  completeOrder,
  cancelOrder,
  getOrderCompleted,
  getOrderCanceled
};
