// emailController.js
const transporter = require('../config/emailAuth.config'); // Import the configured transporter

// Function to send email
const sendEmail = (req, res) => {
  const { to, subject, text } = req.body;

  // Setup email options
  const mailOptions = {
    from: '"TPExpress" <ngthuythienphuc2002@gmail.com>', // Sender address
    to: to, // Recipient address
    subject: subject, // Subject line
    text: text, // Plain text body
    // html: '<b>Hello World?</b>' // Optional: if you want to send HTML email
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send({ message: 'Error sending email', error });
    }
    res.status(200).send({ message: 'Email sent successfully!', info });
  });
};

// Export the sendEmail function for use in routes
module.exports = { sendEmail };
