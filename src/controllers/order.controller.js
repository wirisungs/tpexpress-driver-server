const { json } = require("express");
const Order = require('../models/Order.model');

//Generate orderId
const generateOrderId = async () => {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Create order
const createOrder = async (req, res) => {
  const { customerId, item, pickupLocation, dropoffLocation } = req.body;

  // Validate required fields
  if (!customerId || !item || !pickupLocation || !dropoffLocation) {
    return res.status(400).json({ message: 'Customer ID, item, pickupLocation, and dropoffLocation are required' });
  }
  try {
    const orderId = await generateOrderId(); // Assuming generateOrderId is defined elsewhere
    const newOrder = new Order({
      orderId,
      customerId,
      item,
      pickupLocation,
      dropoffLocation,
      status: 'Pending' // Default status
    });

    console.log('Order created:', newOrder);

    await newOrder.save();
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

// Accept order
const acceptOrder = async (req, res) => {
  const { orderId } = req.params;
  const { driverId } = req.body;
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
    res.status(500).json({ message: 'Server error', error });
  }
};

// Reject order
const rejectOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.status !== 'Pending') {
      return res.status(400).json({ message: 'Order is not available for rejection' });
    }
    order.status = 'Rejected';
    await order.save();
    res.status(200).json({ message: 'Order rejected successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Complete order
const completeOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.status !== 'Shipping') {
      return res.status(400).json({ message: 'Order is not available for completion' });
    }
    order.status = 'Completed';
    await order.save();
    res.status(200).json({ message: 'Order completed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.status !== 'Shipping') {
      return res.status(400).json({ message: 'Order is not available for cancellation' });
    }
    order.status = 'Cancelled';
    await order.save();
    res.status(200).json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { createOrder, acceptOrder, rejectOrder, completeOrder, cancelOrder };