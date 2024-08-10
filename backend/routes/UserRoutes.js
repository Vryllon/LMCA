const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

// Middleware for validating request body
const validateUser = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }
  next();
};

// Create a new user
router.post('/users', validateUser, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if a user with the same username already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken.' });
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // Return user without password
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username
    });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

// Check Login Credentials
router.post('/login', validateUser, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if a user with that username exists
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: 'Username does not exist' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // Return user without password
      res.status(200).json({
        message: 'Login successful',
        user: {
          _id: user._id,
          username: user.username
        }
      });
    } else {
      res.status(400).json({ error: 'Password is incorrect' });
    }

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

module.exports = router;
