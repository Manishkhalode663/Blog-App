const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Kept required: true, so we MUST generate this in Passport strategies
  username: { type: String, required: true, unique: true }, 
  email:    { type: String, required: true, unique: true },
  
  // MODIFIED: Removed 'required: true' to support Social Logins
  password: { type: String }, 
  
  // NEW: Store social IDs. 'sparse: true' allows multiple users to have null values.
  googleId: { type: String, unique: true, sparse: true },
  appleId:  { type: String, unique: true, sparse: true },

  avatar:   { type: String, default: 'https://i.pravatar.cc/150' }, 
  createdAt:{ type: Date, default: Date.now }
});

// --- PASSWORD HASHING MIDDLEWARE ---
userSchema.pre('save', async function() { 
  // 1. If there is no password (social login user), stop here.
  if (!this.password) return; 

  // 2. If password exists but hasn't changed, stop here.
  if (!this.isModified('password')) return; 

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err;
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  // If user has no password set, they cannot login with password
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   email:    { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   avatar:   { type: String, default: 'https://i.pravatar.cc/150' }, 
//   createdAt:{ type: Date, default: Date.now }
// });

// // --- FIXED SECTION START ---
// // Remove 'next' from the arguments. 
// // With async/await, Mongoose waits for the function to return.
// userSchema.pre('save', async function() { 
//   if (!this.isModified('password')) return; // Just return, don't call next()

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     // Function ends here automatically, which tells Mongoose to proceed.
//   } catch (err) {
//     throw err; // Throwing an error stops the save process
//   }
// });
// // --- FIXED SECTION END ---

// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// module.exports = mongoose.model('User', userSchema);