const { json } = require("express");

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

module.exports = { acceptOrder, rejectOrder };