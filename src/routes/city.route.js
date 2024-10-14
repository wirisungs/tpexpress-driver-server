const express = require('express');
const { getCityList } = require('../controllers/city.controller');
const router = express.Router();

router.get('/', getCityList);

module.exports = router;
