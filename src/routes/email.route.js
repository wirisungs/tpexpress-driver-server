// routes.js
const express = require('express');
const { sendEmail } = require('../controllers/email.controller'); // Import the email controller
const router = express.Router();

// Route for sending emails
router.post('/send-email', sendEmail);

module.exports = router;
