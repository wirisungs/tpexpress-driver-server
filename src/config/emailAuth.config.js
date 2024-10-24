// emailAuth.js
const nodemailer = require('nodemailer');
require('dotenv').config();
// Configure and create transporter object
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to other providers like 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL, // Your email address
    pass: process.env.EMAIL_PASS,  // Your email password or app-specific password for Gmail
  },
});
// Export the transporter object for use in the controller
module.exports = transporter;
