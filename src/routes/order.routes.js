const express = require('express');
const router = express.Router();
const controller = require('../controllers/order.controller');

router.post('/accept', controller.acceptOrder);
router.post('/reject', controller.rejectOrder);
router.post('/complete', controller.completeOrder);
router.post('/cancel', controller.cancelOrder);

module.exports = router;