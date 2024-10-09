const express = require('express');
const router = express.Router();
const controller = require('../controllers/order.controller');

router.post('/create', controller.createOrder);
router.post('/accept/:orderId', controller.acceptOrder);
router.post('/reject/:orderId', controller.rejectOrder);
router.post('/complete/:orderId', controller.completeOrder);
router.post('/cancel/:orderId', controller.cancelOrder);

module.exports = router;