// 2FA setup and verification routes
const express = require('express');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const { User } = require('../schema');

const router = express.Router();

// Route to generate 2FA secret and QR code
router.post('/2fa/setup', async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const secret = speakeasy.generateSecret({ name: `FeedbackSystem (${user.email})` });
  user.twoFactorSecret = secret.base32;
  user.isTwoFactorEnabled = true;
  await user.save();

  qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
    if (err) return res.status(500).json({ message: 'QR code error' });
    res.json({ qr: data_url, secret: secret.base32 });
  });
});

// Route to verify 2FA token
router.post('/2fa/verify', async (req, res) => {
  const { userId, token } = req.body;
  const user = await User.findById(userId);
  if (!user || !user.twoFactorSecret) return res.status(404).json({ message: '2FA not set up' });

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token,
  });
  res.json({ verified });
});

module.exports = router;
