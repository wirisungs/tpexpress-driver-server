const express = require('express');
const router = express.Router();
const controller = require('../controllers/order.controller');

router.get('/', controller.getOrder);
router.post('/create', controller.createOrder);
router.put('/accept/:orderId', controller.acceptOrder);
router.put('/reject/:orderId', controller.rejectOrder);
router.put('/complete/:orderId', controller.completeOrder);
router.put('/cancel/:orderId', controller.cancelOrder);

module.exports = router;