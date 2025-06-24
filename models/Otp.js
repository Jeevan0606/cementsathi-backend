const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // Expires in 5 minutes
  lastSentAt: { type: Date, default: Date.now }, // Used for resend cooldown
});

module.exports = mongoose.model('Otp', otpSchema);
