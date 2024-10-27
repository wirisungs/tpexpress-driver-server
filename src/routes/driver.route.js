const express = require('express');
const router = express.Router();
const { toggleDriverStatus, authenticateToken } = require('../controllers/driver.controller');

router.post('/toggle-status', authenticateToken, toggleDriverStatus);

module.exports = router;
