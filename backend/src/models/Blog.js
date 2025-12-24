const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true }, // Full blog content
  image: { type: String }, // URL to image
  category: { type: String },
  tags: { type: [String] },
  author: { type: String, default: 'Admin' }, 
  status: { type: String, default: 'published' }, 
  authorAvatar: { type: String },
  readTime: { type: String },
  publishedAt: { type: Date, default: null },
  scheduledAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
}); 

blogSchema.index({ status: 1, scheduledAt: 1 });
 
module.exports = mongoose.model('Blog', blogSchema);    