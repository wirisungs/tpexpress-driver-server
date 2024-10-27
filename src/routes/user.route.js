const express = require('express');
const router = express.Router();
const { fetchUserProfile, updateUserProfile } = require('../controllers/user.controller');
const { authenticateUser } = require('../middleware/auth.middleware');

// Define routes
router.get('/profile', authenticateUser, fetchUserProfile);
router.put('/profile/update', authenticateUser, updateUserProfile);

module.exports = router;
