const { getItem } = require('../controllers/item.controller');
const express = require('express');
const router = express.Router();

// Route for getting items
router.get('/get-item', getItem);

module.exports = router;
