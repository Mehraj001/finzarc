const router = require('express').Router();
const User = require('../models/User');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    // Create new user
    const newUser = new User({ username, password });
    const savedUser = await newUser.save();
    
    res.status(201).json({
      id: savedUser._id,
      username: savedUser.username
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    
    // Validate password
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    
    res.json({
      id: user._id,
      username: user.username
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 