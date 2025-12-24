const Blog = require('../models/Blog');

// Logic to get all blogs
const getBlogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;
    const blogs = await Blog.find({ status: 'published' }).sort({ createdAt: -1 }).limit(limit);
    const totalBlogs = await Blog.countDocuments({ status: 'published' });

    return res.json({
      results: blogs,
      total: totalBlogs
    });
  } catch (err) {
    console.error("Error in getBlogs:", err);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to fetch blogs',
      details: err.message
    });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        message: 'Blog not found'
      });
    }

    // --- LOGIC START ---

    // 1. Is the blog Public?
    const isPublic = blog.status === 'published';

    // 2. Is the requester the Author? 
    // (Check if req.user exists first, in case a guest is visiting)
    const isAuthor = req.user && req.user.username === blog.author;

    // 3. The Gatekeeper
    // If it is NOT public AND the user is NOT the author -> Hide it (404 or 403)
    if (!isPublic && !isAuthor) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        message: 'Blog not found'
      });
      // We return 404 instead of 403 to prevent strangers from guessing IDs of drafts.
    }
    // --- LOGIC END ---

    return res.json(blog);
  } catch (err) {
    console.error("Error in getBlogById:", err);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to fetch blog',
      details: err.message
    });
  }
};

const getBlogByAuthor = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.author }).sort({ createdAt: -1 });
    return res.json(blogs);
  } catch (err) {
    console.error("Error in getBlogByAuthor:", err);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to fetch blogs by author',
      details: err.message
    });
  }
};

// Logic to create a new blog
const createBlog = async (req, res) => {
  try {
    // 1. Sanitize the Image Field
    let imagePath = 'https://picsum.photos/800/600';
    if (req.body.image && typeof req.body.image === 'string') {
      imagePath = req.body.image;
    }

    // 2. Sanitize the Avatar Field (Just in case)
    let avatarPath = 'https://i.pravatar.cc/150';
    if (req.body.authorAvatar && typeof req.body.authorAvatar === 'string') {
      avatarPath = req.body.authorAvatar;
    }

    let tags = [];
    if (req.body.tags) {
      tags = Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags];
    }

    const blog = new Blog({
      title: req.body.title,
      excerpt: req.body.excerpt,
      content: req.body.content,
      category: req.body.category,
      tags: tags || [],
      readTime: req.body.readTime,
      author: req.body.author,
      status: req.body.status || 'published', 
      publishedAt: null,
      scheduledAt: null,
      image: imagePath,
      authorAvatar: avatarPath
    });

    if (blog.status === 'published') {
      blog.publishedAt = Date.now();
    }
    if (blog.status === 'scheduled') {
      blog.scheduledAt =  req.body.scheduleDate || null;
    }

    const newBlog = await blog.save();
    return res.status(201).json(newBlog);
  } catch (err) {
    console.error("Error creating blog:", err);
    return res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: 'Failed to create blog',
      details: err.message
    });
  }
};

// Logic to update an old blog
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        message: 'Blog not found'
      });
    }

    // 1. Sanitize the Image Field
    let imagePath = blog.image;
    if (req.body.image && typeof req.body.image === 'string') {
      imagePath = req.body.image;
    }

    // 2. Sanitize the Avatar Field
    let avatarPath = blog.authorAvatar;
    if (req.body.authorAvatar && typeof req.body.authorAvatar === 'string') {
      avatarPath = req.body.authorAvatar;
    }

    let tags = [];
    if (req.body.tags) {
      tags = Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags];
    }

    // Update fields
    blog.title = req.body.title;
    blog.excerpt = req.body.excerpt;
    blog.content = req.body.content;
    blog.category = req.body.category;
    blog.tags = tags || [];
    blog.readTime = req.body.readTime;
    blog.image = imagePath;
    blog.authorAvatar = avatarPath;
    blog.status = req.body.status || 'published'; 
    if (blog.status === 'published') {
      blog.publishedAt = Date.now();
    }
    if (blog.status === 'scheduled') {
      blog.scheduledAt =  req.body.scheduleDate || null;
    }

    const updatedBlog = await blog.save();
    return res.status(200).json({
      data: updatedBlog,
      code: 'SUCCESS',
      message: 'Blog updated successfully'
    });
  } catch (err) {
    console.error("Error updating blog:", err);
    return res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: 'Failed to update blog',
      details: err.message
    });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        message: 'Blog not found'
      });
    }
    await blog.deleteOne();
    return res.json({
      code: 'SUCCESS',
      message: 'Blog deleted successfully'
    });
  } catch (err) {
    console.error("Error deleting blog:", err);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to delete blog',
      details: err.message
    });
  }
};

module.exports = {
  getBlogs,
  createBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogByAuthor
};
