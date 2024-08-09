const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

// Create a new user
router.post('/users', async (req, res) => {
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
    res.status(201).json(newUser);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check Login Credentials
router.post('/login', async (req, res) => {
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
      res.status(200).json({ message: 'Login successful', user });
    } else {
      res.status(400).json({ error: 'Password is incorrect' });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
