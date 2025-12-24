const mongoose = require('mongoose');

const archivedBlogSchema = new mongoose.Schema({
  // --- Metadata for Archiving ---
  originalId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    index: true // Index this for faster restoration
  },
  archivedAt: { 
    type: Date, 
    default: Date.now 
  },
  archivedBy: {
    type: String // Username of who archived it
  },

  // --- Original Fields (Copied from Blog.js) ---
  title: { type: String, required: true },
  excerpt: { type: String },
  content: { type: String },
  image: { type: String },
  category: { type: String },
  author: { type: String },
  authorAvatar: { type: String },
  readTime: { type: String },
  tags: [String],
  
  // We keep the original creation dates
  originalCreatedAt: { type: Date },
  originalUpdatedAt: { type: Date }

}, { timestamps: true }); // This adds createdAt (archival date) automatically

module.exports = mongoose.model('ArchivedBlog', archivedBlogSchema);