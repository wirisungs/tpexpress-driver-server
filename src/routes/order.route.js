const express = require('express');
const router = express.Router();
const { getOrder, getOrderOngoing, getOrderDetails, acceptOrder, completeOrder, cancelOrder, getOrderCompleted, getOrderCanceled } = require('../controllers/order.controller');
const { authenticateUser } = require('../middleware/auth.middleware'); // Middleware to authenticate user

// Define routes
router.get('/pending', authenticateUser, getOrder);
router.get('/ongoing', authenticateUser, getOrderOngoing);
router.get('/:orderId', authenticateUser, getOrderDetails);
router.put('/accept/:orderId', authenticateUser, acceptOrder);
router.put('/complete/:orderId', authenticateUser, completeOrder);
router.put('/cancel/:orderId', authenticateUser, cancelOrder);
router.get('/completed', authenticateUser, getOrderCompleted);
router.get('/canceled', authenticateUser, getOrderCanceled);

module.exports = router;
