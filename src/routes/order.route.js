const express = require('express');
const router = express.Router();
const { getOrder, getOrderOngoing, getOrderDetails, acceptOrder, completeOrder, cancelOrder } = require('../controllers/order.controller');
const { authenticateUser } = require('../middleware/auth.middleware'); // Middleware to authenticate user

// Define routes
router.get('/pending', authenticateUser, getOrder);
router.get('/ongoing', authenticateUser, getOrderOngoing);
router.get('/:Order_ID', authenticateUser, getOrderDetails);
router.put('/accept/:Order_ID', authenticateUser, acceptOrder);
router.put('/complete/:Order_ID', authenticateUser, completeOrder);
router.put('/cancel/:Order_ID', authenticateUser, cancelOrder);

module.exports = router;
