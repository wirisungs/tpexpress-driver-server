const express = require('express');
const router = express.Router();
const { toggleDriverStatus } = require('../controllers/driver.controller');
const { authenticateUser } = require('../middleware/auth.middleware');

router.post('/toggle-status', authenticateUser, toggleDriverStatus);

module.exports = router;
