const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Organization = require('../models/Organization');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

// JWT secret (for real applications, use environment variables)
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  // Validate required fields
  if (!usernameOrEmail || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid login credentials.' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid login credentials.' });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    
    console.log('JWT_SECRET used for token signing:', process.env.JWT_SECRET);

    // Return token and user details (excluding password)
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// router.get('/me', authMiddleware, async (req, res) => {
//   try {
//     console.log('Request User:', req.user);
//     const user = await User.findById(req.user.userId).select('-password'); // Do not return password
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json(user); // Send back user data
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

router.get('/me', authMiddleware, async (req, res) => {
  try {
    console.log('Request User:', req.user);
  
  // Find the user by ID from the users collection
    const user = await User.findById(req.user.userId).select('-password'); // Do not return password
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the organization by matching organizationCode
    const organization = await Organization.findOne({ organizationCode: user.organizationCode });
    console.log(organization)
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.json({user,organization});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/addUser', async (req, res) => {
  const { firstName, lastName, role } = req.body;

  try {
    // Generate username and password in backend
    const username = firstName.toLowerCase() + Math.floor(Math.random() * 1000);
    const password = Math.random().toString(36).slice(-8); // Random 8-character password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      username,
      password: hashedPassword,
      role, // Assume you're passing this in req.user
    });
    console.log(newUser);
    await newUser.save();

    // Send generated username and password back to the frontend for display
    res.status(201).json({ username, password });
  } catch (error) {
    res.status(500).json({ message: 'Error adding user', error });
  }
});

// router.get('/users', async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// console.log('JWT_SECRET from auth.js:', process.env.JWT_SECRET);
router.post('/check-email', async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.json({ exists: true });
    }
    res.json({ exists: false });
  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Check username availability
router.post('/check-username', async (req, res) => {
  const { username } = req.body;
  try {
    const existingUser = await Admin.findOne({ username });
    if (existingUser) {
      return res.json({ exists: true });
    }
    res.json({ exists: false });
  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Signup route
router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, username, password, confirmPassword, phoneNumber, organizationCode } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !username || !password || !confirmPassword || !phoneNumber || !organizationCode) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  try {
    // Check if the organization code is valid
    const organization = await Organization.findOne({ organizationCode });
    if (!organization) {
      return res.status(400).json({ message: 'Invalid organization code.' });
    }

    // Check if the username or email already exists
    const existingUser = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already in use.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
      phoneNumber,
      organizationCode,
    });

    // Save admin to database
    await newAdmin.save();

    const newUser = new User({
        firstName, lastName, email, username,
        password: hashedPassword,
        role: 'admin',
        organizationCode 
    });

    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ id: newAdmin._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'Admin registered successfully.', token });
  } catch (error) {
    console.error('Error during signup:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;

