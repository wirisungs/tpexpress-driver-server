const express = require('express');
const router = express.Router();
const { fetchUserProfile, updateUserProfile, getDriver, getUserEmail, saveUserProfileFromSSO, checkDriverEmail } = require('../controllers/user.controller');

// Define routes
router.get('/profile/:driverId', fetchUserProfile);
router.put('/profile/update', updateUserProfile);
router.get('/driver/:id', getDriver);
router.get('/email', getUserEmail);
router.post('/sso/save', saveUserProfileFromSSO);
router.get('/email/check', checkDriverEmail);

module.exports = router;
