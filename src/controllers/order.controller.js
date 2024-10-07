const { json } = require("express");

// Accept order
const acceptOrder = (req, res) => {
  const { orderId, driverId } = req.body;
  const order = orders.find(o => o.orderId === parseInt(orderId));
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  if (order.status !== 'Pending') {
    return res.status(400).json({ message: 'Order is not available for acceptance' });
  }
  order.status = 'Accepted';
  order.driverId = driverId;
  res.status(200).json({ message: 'Order accepted successfully', order });
};

// Reject order
const rejectOrder = (req, res) => {
  const { orderId } = req.body;
  const order = orders.find(o => o.orderId === parseInt(orderId));
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  if (order.status !== 'Pending') {
    return res.status(400).json({ message: 'Order is not available for rejection' });
  }
  order.status = 'Rejected';
  res.status(200).json({ message: 'Order rejected successfully', order });
}

// Complete order
const completeOrder = (req, res) => {
  const { orderId } = req.body;
  const order = orders.find(o => o.orderId === parseInt(orderId));
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  if (order.status !== 'Accepted') {
    return res.status(400).json({ message: 'Order is not available for completion' });
  }
  order.status = 'Completed';
  res.status(200).json({ message: 'Order completed successfully', order });
}

// Cancel order
const cancelOrder = (req, res) => {
  const { orderId } = req.body;
  const order = orders.find(o => o.orderId === parseInt(orderId));
  if(!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  if (order.status !== 'Accepted') {
    return res.status(400).json({ message: 'Order is not available for cancellation' });
  }
  order.status = 'Cancelled';
  res.status(200).json({ message: 'Order cancelled successfully', order });
}

module.exports = { acceptOrder, rejectOrder, completeOrder, cancelOrder };