const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();
const Otp = require('../models/Otp');

const router = express.Router();

// Setup Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send OTP
router.post('/send', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const existingOtp = await Otp.findOne({ email });

    if (existingOtp && Date.now() - existingOtp.lastSentAt.getTime() < 30000) {
      const waitTime = 30 - Math.floor((Date.now() - existingOtp.lastSentAt.getTime()) / 1000);
      return res.status(429).json({
        message: `Please wait ${waitTime} more seconds before requesting a new OTP.`,
      });
    }

    await Otp.deleteMany({ email }); // Remove old OTPs

    await Otp.create({ email, otp, lastSentAt: new Date() });

    await transporter.sendMail({
      from: `"CementSathi ⚒️" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🛡️ Your CementSathi Login OTP',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #f9f9f9; max-width: 500px; margin: auto;">
          <h2 style="color: #0d6efd;">Welcome back to CementSathi 👋</h2>
          <p style="font-size: 16px;">Hi there!</p>
          <p style="font-size: 16px;">Use the following OTP to complete login:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #0d6efd; background: #fff; padding: 12px 24px; border: 2px dashed #0d6efd; border-radius: 6px;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 14px;">This OTP is valid for 5 minutes.</p>
          <p style="font-size: 14px;">Thanks, <br/>Team CementSathi ⚒️</p>
        </div>
      `,
    });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify OTP
router.post('/verify', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    await Otp.deleteOne({ _id: record._id }); // Clean up OTP after verification
    res.status(200).json({ message: 'OTP verified' });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
});

module.exports = router;
