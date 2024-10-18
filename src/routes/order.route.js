const express = require('express');
const router = express.Router();
const { getOrder, getOrderOngoing, createOrder, acceptOrder, rejectOrder, completeOrder, cancelOrder } = require('../controllers/order.controller');
const { authenticateUser } = require('../controllers/auth.controller'); // Middleware to authenticate user
const { create } = require('../models/User.model');

// Define routes
router.get('/', getOrder);
router.get('/ongoing', authenticateUser, getOrderOngoing);
// router.post('/create', authenticateUser, createOrder);
router.post('/create', createOrder);
router.put('/accept/:orderId', authenticateUser, acceptOrder);
router.put('/reject/:orderId', authenticateUser, rejectOrder);
router.put('/complete/:orderId', authenticateUser, completeOrder);
router.put('/cancel/:orderId', authenticateUser, cancelOrder);

module.exports = router;
