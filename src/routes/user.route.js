const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');

router.get('/profile', controller.authenticateUser, controller.getUserProfile);



module.exports = router;