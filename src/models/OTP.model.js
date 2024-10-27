const mongoose = require('mongoose')

const OTPSchema = new mongoose.Schema({
  userPhone: {
    type: String,
    required: true,
    ref: 'User'
  },
  otpCode: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, [{ collection: 'OTP' }])

module.exports = mongoose.model('OTP', OTPSchema)
