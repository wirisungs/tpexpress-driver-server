const express = require('express');
const router = express.Router();
const { fetchUserProfile, updateUserProfile, getDriver, getUserEmail, saveUserProfileFromSSO, checkDriverEmail } = require('../controllers/user.controller');
const { authenticateUser } = require('../middleware/auth.middleware');

// Define routes
router.get('/profile', authenticateUser, fetchUserProfile);
router.put('/profile/update', authenticateUser, updateUserProfile);
router.get('/driver/:id', authenticateUser, getDriver);
router.get('/email', authenticateUser, getUserEmail);
router.post('/sso/save', authenticateUser, saveUserProfileFromSSO);
router.get('/email/check', authenticateUser, checkDriverEmail);

module.exports = router;
