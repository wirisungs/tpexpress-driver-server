const express = require('express');
const router = express.Router();
const { registerUser, loginUser, authenticateUser, getUserProfile } = require('../controllers/auth.controller');

// Define routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticateUser, getUserProfile);

module.exports = router;
