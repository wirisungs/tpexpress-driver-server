const express = require('express');
const router = express.Router();
const { toggleDriverStatus, authenticateUser } = require('../controllers/driver.controller');

router.post('/toggle-status', authenticateUser, toggleDriverStatus);

module.exports = router;
