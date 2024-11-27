const express = require('express');
const router = express.Router();
const { getOrder, getOrderOngoing, getOrderDetails, acceptOrder, completeOrder, cancelOrder, getOrderCompleted, getOrderCanceled, calculateRevenue } = require('../controllers/order.controller');

// Define routes
router.get('/pending', getOrder);
router.get('/ongoing/:driverId', getOrderOngoing);
router.get('/:orderId', getOrderDetails);
router.put('/accept/:orderId', acceptOrder);
router.put('/complete/:orderId', completeOrder);
router.put('/cancel/:orderId', cancelOrder);
router.get('/completed', getOrderCompleted);
router.get('/canceled', getOrderCanceled);
router.get('/revenue/:driverId', calculateRevenue);

module.exports = router;
