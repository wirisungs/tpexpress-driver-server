// emailAuth.js
const nodemailer = require('nodemailer');
// Configure and create transporter object
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to other providers like 'outlook', 'yahoo', etc.
  auth: {
    user: 'phucplaymc@gmail.com', // Your email address
    pass: 'ujti dbup bfww pfkx',  // Your email password or app-specific password for Gmail
  },
});
// Export the transporter object for use in the controller
module.exports = transporter;
