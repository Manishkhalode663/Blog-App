const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Authentication Fields
  username: { type: String, required: true, unique: true }, 
  email:    { type: String, required: true, unique: true },
  password: { type: String }, 
  
  // Social Login IDs
  googleId: { type: String, unique: true, sparse: true },
  appleId:  { type: String, unique: true, sparse: true },

  // Profile Image
  avatar:   { type: String, default: 'https://i.pravatar.cc/150' }, 

  // --- NEW PROFILE FIELDS ---
  bio:        { type: String, maxlength: 300 }, // Short summary for cards
  about:      { type: String }, // Detailed "About Me" section
  dob:        { type: Date },
  experience: { type: String }, // e.g., "Senior Developer", "5 Years"
  website:    { type: String },
  location:   { type: String }, // e.g., "New York, USA"
  role:       { type: String, default: 'Author', enum: ['User', 'Author', 'Admin'] }, 
  // --------------------------

  createdAt: { type: Date, default: Date.now }
});

// --- PASSWORD HASHING MIDDLEWARE ---
userSchema.pre('save', async function() { 
  if (!this.password) return; 
  if (!this.isModified('password')) return; 

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err;
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);