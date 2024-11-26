const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/auth.controller');
const { authenticateUser } = require('../middleware/auth.middleware');

// Define routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticateUser, getUserProfile);

module.exports = router;
