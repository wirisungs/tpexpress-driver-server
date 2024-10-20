const { json } = require('body-parser');
const Order = require('../models/Order.model');
const User = require('../models/User.model');

// Get orders with status 'Pending'
const getOrder = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'Pending' }).lean();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
};

// Get orders with status 'Shipping' and match driverId by authenticated user
const getOrderOngoing = async (req, res) => {
  const { driverId } = req.user; // Assuming req.user contains the authenticated user's information
  try {
    // Fetch all orders where the status is 'Shipping' and driverId matches
    const orders = await Order.find({ status: 'Shipping', driverId }).lean();
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    // Return a 500 status for server errors
    res.status(500).json({ error: 'Error fetching ongoing orders' });
  }
};

// Generate a unique order ID
const generateOrderId = async () => {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Create a new order
const createOrder = async (req, res) => {
  const { customerId, item, pickupLocation, dropoffLocation, note, price } = req.body;

  // Validate required fields
  if (!customerId || !item || !pickupLocation || !dropoffLocation) {
    return res.status(400).json({ message: 'Customer ID, item, pickupLocation, and dropoffLocation are required' });
  }
  try {
    const orderId = await generateOrderId();
    const newOrder = new Order({
      orderId,
      customerId,
      item,
      pickupLocation,
      dropoffLocation,
      note,
      price,
      status: 'Pending' // Default status
    });

    console.log('Order created:', newOrder);

    await newOrder.save();
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

// Accept an order
const acceptOrder = async (req, res) => {
  const { orderId } = req.params;
  const driverId = req.user.driverId; // Assuming req.user contains the authenticated user's information
  try {
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.status !== 'Pending') {
      return res.status(400).json({ message: 'Order is not available for acceptance' });
    }
    order.status = 'Shipping';
    order.driverId = driverId;
    await order.save();
    res.status(200).json({ message: 'Order accepted successfully', order });
  } catch (error) {
    console.error('Error accepting order:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Reject an order
const rejectOrder = async (req, res) => {
  const { orderId } = req.params;
  const driverId = req.user.driverId; // Assuming req.user contains the authenticated user's information
  try {
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.status !== 'Pending') {
      return res.status(400).json({ message: 'Order is not available for rejection' });
    }
    order.status = 'Rejected';
    order.driverId = driverId;
    await order.save();
    res.status(200).json({ message: 'Order rejected successfully', order });
  } catch (error) {
    console.error('Error rejecting order:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Complete an order
const completeOrder = async (req, res) => {
  const { orderId } = req.params;
  const driverId = req.user.driverId; // Assuming req.user contains the authenticated user's information
  try {
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.status !== 'Shipping') {
      return res.status(400).json({ message: 'Order is not available for completion' });
    }
    order.status = 'Completed';
    order.driverId = driverId;
    await order.save();
    res.status(200).json({ message: 'Order completed successfully', order });
  } catch (error) {
    console.error('Error completing order:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Cancel an order
const cancelOrder = async (req, res) => {
  const { orderId } = req.params;
  const driverId = req.user.driverId; // Assuming req.user contains the authenticated user's information
  try {
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.status !== 'Shipping') {
      return res.status(400).json({ message: 'Order is not available for cancellation' });
    }
    order.status = 'Cancelled';
    order.driverId = driverId;
    await order.save();
    res.status(200).json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { getOrder, getOrderOngoing, createOrder, acceptOrder, rejectOrder, completeOrder, cancelOrder };const { find, findOne } = require('../models/User.model');
