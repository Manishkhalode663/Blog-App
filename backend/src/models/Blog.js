const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
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

// ⚡ IMPROVEMENT: Add Compound Index for Filtering & Sorting
blogSchema.index({ status: 1, createdAt: -1 });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ tags: 1, status: 1 });

// ⚡ IMPROVEMENT: Add Text Index for Search
blogSchema.index({ 
  title: 'text', 
  content: 'text', 
  excerpt: 'text', 
  tags: 'text' 
}, {
  weights: {
    title: 10,    // Title matches are most important
    tags: 5,      // Tags are second
    excerpt: 3,
    content: 1
  }
});
 
module.exports = mongoose.model('Blog', blogSchema);