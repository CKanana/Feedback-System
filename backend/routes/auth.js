const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../schema');
const authenticateToken = require('../middleware/auth');
const admin = require('../firebase');


// Multer setup for photo upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }

});

const upload = multer({ storage });

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -twoFactorSecret -jwtToken');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update current user profile (name, department, photo)
router.put('/me', authenticateToken, upload.single('photo'), async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (req.body.name) user.name = req.body.name;
    if (req.body.department) user.department = req.body.department;
    if (req.file) {
      // Save photo path relative to /uploads
      user.photo = '/uploads/' + req.file.filename;
    }
    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Signup Route with Firebase email verification
router.post('/signup', async (req, res) => {
  try {
    let { name, email, password, role, department, firebaseUid } = req.body;
    if (!role) role = 'staff';
    const existingUser = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Ensure JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in .env file");
    }

    // If firebaseUid is provided, skip Firebase creation and just save to MongoDB
    if (firebaseUid) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword, role, department, firebaseUid });
      await user.save();
      return res.status(201).json({
        message: 'User registered in MongoDB.',
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    }

    // Otherwise, create user in Firebase as before
    let firebaseUser;
    try {
      firebaseUser = await admin.auth().createUser({
        email,
        password,
        displayName: name,
      });
      // Generate Firebase email verification link
      const link = await admin.auth().generateEmailVerificationLink(email);
      // Save firebaseUid in MongoDB
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword, role, department, firebaseUid: firebaseUser.uid });
      await user.save();
      // If admin, return admin redirect info
      if (role === 'admin') {
        return res.status(201).json({
          message: 'Admin registered. Please verify your email before logging in.',
          verificationLink: link,
          user: { id: user._id, name: user.name, email: user.email, role: user.role },
          redirect: '/admin',
        });
      }
      return res.status(201).json({
        message: 'User registered. Please verify your email before logging in.',
        verificationLink: link,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    } catch (fbErr) {
      console.error('Firebase user creation error:', fbErr);
      
      // Rollback: If MongoDB save failed but Firebase user was created, delete from Firebase
      if (firebaseUser) {
        await admin.auth().deleteUser(firebaseUser.uid).catch(e => console.error("Rollback failed:", e));
      }

      return res.status(500).json({ message: 'Firebase error', error: fbErr.message, details: fbErr });
    }
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login Route (no email verification check)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    user.jwtToken = token;
    await user.save();
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by email (used by frontend login to check status)
router.get('/user-by-email', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Email verification endpoint
router.get('/verify-email', async (req, res) => {
  const { uid } = req.query;
  if (!uid) return res.status(400).json({ message: 'Missing uid' });
  try {
    // Check Firebase email verification status
    const firebaseUser = await admin.auth().getUser(uid);
    if (!firebaseUser.emailVerified) {
      return res.status(403).json({ message: 'Email not verified yet.' });
    }
    // Redirect to frontend login page
    res.redirect('http://localhost:3000/auth?verified=true');
  } catch (err) {
    res.status(500).json({ message: 'Verification failed', error: err.message });
  }
});

// DEV ONLY: Force verify a user by email if the link isn't working
router.post('/force-verify', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(user.uid, { emailVerified: true });
    
    res.json({ message: `Successfully verified email for ${email}. You can now log in.` });
  } catch (err) {
    res.status(500).json({ message: 'Could not verify user', error: err.message });
  }
});

module.exports = router;
