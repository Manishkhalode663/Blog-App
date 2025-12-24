const passport = require('passport');
const User = require('../models/User');

// Register User
const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ username, email, password });
    await user.save();

    req.logIn(user, (err) => {
      if (err) throw err;
      const { password, ...userData } = user._doc;
      res.status(201).json(userData);
    });
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

// Get Current User
const getCurrentUser = (req, res) => {
  if (req.user) {
    const { password, ...userData } = req.user._doc;
    res.json(userData);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};

// --- UPDATED PROFILE CONTROLLER ---
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 1. Destructure all possible fields from body
    const { 
      username, 
      email, 
      bio, 
      about, 
      dob, 
      experience, 
      website, 
      location 
    } = req.body;

    // 2. Update Basic Fields
    if (username) user.username = username;
    if (email) user.email = email;

    // 3. Update Profile Details (Only if they exist in request)
    if (bio !== undefined) user.bio = bio;
    if (about !== undefined) user.about = about;
    if (dob !== undefined) user.dob = dob;
    if (experience !== undefined) user.experience = experience;
    if (website !== undefined) user.website = website;
    if (location !== undefined) user.location = location;

    // 4. Update Avatar
    // Note: The 'resizeAvatar' middleware sets req.body.avatar if a file was uploaded.
    if (req.body.avatar) {
        user.avatar = req.body.avatar;
    }

    await user.save();

    // Return clean user object
    const { password, ...userData } = user._doc;
    res.json(userData);

  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

module.exports = { signup, login, logout, getCurrentUser, updateProfile };