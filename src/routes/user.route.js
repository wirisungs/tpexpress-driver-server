const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');

router.get('/', controller.getUserProfile);
router.post('/create', controller.editUserProfile);

module.exports = router;