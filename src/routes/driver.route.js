const express = require('express');
const router = express.Router();
const { toggleDriverStatus } = require('../controllers/driver.controller');
const { authenticateUser } = require('../middleware/auth.middleware');

// Cập nhật sử dụng phương thức PUT để toggle trạng thái tài xế
router.put('/toggle-status/:driverId', toggleDriverStatus);

module.exports = router;
