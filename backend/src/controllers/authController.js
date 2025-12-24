const passport = require('passport');
const User = require('../models/User');

// Register User
const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if user exists
    console.log(req.body);
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });
    console.log(username, email, password);
    console.log(user);
    // Create new user
    user = new User({ username, email, password });
    console.log(user);
    await user.save();

    // Log them in immediately after signup
    req.logIn(user, (err) => {
      if (err) throw err;
      // Return user without password
      const { password, ...userData } = user._doc;
      res.status(201).json(userData);
    });
    console.log(user);
  } catch (err) {
    console.error("Error signing up user:", err);
    res.status(500).json({ message: err.message });
  }
};
// Login User
const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);
      // Success - Send user data back
      const { password, ...userData } = user._doc;
      return res.json(userData);
    });
  })(req, res, next);
};
// Logout User
const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: 'Logged out successfully' });
  });
};

// Get Current User (Persist Session on refresh)
const getCurrentUser = (req, res) => {
  if (req.user) {
    const { password, ...userData } = req.user._doc;
    res.json(userData);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};
// Update User Profile
const updateProfile = async (req, res) => {
  const { username, email, avatar } = req.body;
  try {
    // Find user by ID
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Update fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;
    // Save updated user
    await user.save();
    // Return updated user data
    const { password, ...userData } = user._doc;
    res.json(userData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



module.exports = { signup, login, logout, getCurrentUser ,updateProfile};
