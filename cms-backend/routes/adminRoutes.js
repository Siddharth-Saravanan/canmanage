// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const User = require('../models/User'); // Ensure this is the correct path to your User model
// const { authMiddleware } = require('../middleware/authMiddleware'); // Add your middleware

// // POST route to add a new user
// router.post('/addUser', authMiddleware, async (req, res) => {
//   const { firstName, lastName, role } = req.body;

//   // Generate username and password
//   const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
//   const password = `${firstName.toLowerCase()}${Math.floor(Math.random() * 1000)}`;

//   try {
//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user
//     const newUser = new User({
//       firstName,
//       lastName,
//       username,
//       password: hashedPassword,
//       role
//     });

//     // Save the user to the database
//     await newUser.save();

//     res.json({ message: 'User added successfully', credentials: { username, password } });
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding user', error: error.message });
//   }
// });

// // GET route to fetch users
// router.get('/users', authMiddleware, async (req, res) => {
//   try {
//     // Fetch all users (you can limit fields returned with select)
//     const users = await User.find().select('-password'); // Exclude password from response
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching users', error: error.message });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming this is the path to your User model
require('dotenv').config();

// Add User Route
router.post('/addUser', async (req, res) => {
  const { firstName, lastName, role } = req.body;
  console.log(firstName + ' ' + lastName + ' ' + role);
  // Basic validation
  if (!firstName || !lastName || !role) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  } else {
    console.log('Naa dhaan da mass uh');
  }

  // Generate username and password
  const username = `${firstName}.${lastName}`.toLowerCase();
  const password = Math.random().toString(36).slice(-8); // Simple random password generator
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      username,
      password: hashedPassword,
      role,
      organizationCode: 'AVV123', // Default organization code
    });

    console.log('Please',newUser);

    console.log('Saving user: ', newUser);
    await newUser.save();
    console.log('Kambi enna poringa bhai: ', newUser);
    // Send the generated username and password back to the client
    res.status(201).json({
      message: 'User added successfully',
      credentials: {
        username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
        password: password, // Return the plain password here
      }
    });
  } catch (error) {
    if (error.code === 11000) { // MongoDB duplicate key error
      return res.status(400).json({ message: 'Username already exists' });
    }
    res.status(500).json({ message: 'Error adding user', error });
  }
});

// Get All Users Route
router.get('/users', async (req, res) => {
  try {
    console.log('Logesh: Full Stack Dev');
    const users = await User.find().select('-password'); // Fetch users without returning the password field
    console.log('Logesh: Backend Dev',users);
    // console.log(users);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

router.delete('/deleteUser', async (req, res) => {
  try {
    const { username } = req.body; // Receive the username directly in the request body
    console.log("Delete bunda");
    // Prevent deletion of the admin user
    if (username === 'SidAmrita') {
      return res.status(400).json({ message: 'Cannot delete admin user' });
    }

    const deletedUser = await User.findOneAndDelete({ username });
    
    if (deletedUser) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
