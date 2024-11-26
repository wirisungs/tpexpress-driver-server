const express = require('express');
const router = express.Router();
const { getOrder, getOrderOngoing, getOrderDetails, acceptOrder, completeOrder, cancelOrder, getOrderCompleted, getOrderCanceled } = require('../controllers/order.controller');
const { authenticateUser } = require('../middleware/auth.middleware'); // Middleware to authenticate user

// Define routes
router.get('/pending', getOrder);
router.get('/ongoing/:driverId', getOrderOngoing);
router.get('/:orderId', getOrderDetails);
router.put('/accept/:orderId', acceptOrder);
router.put('/complete/:orderId', completeOrder);
router.put('/cancel/:orderId', cancelOrder);
router.get('/completed', getOrderCompleted);
router.get('/canceled', getOrderCanceled);

module.exports = router;
