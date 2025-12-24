const express = require('express');
const router = express.Router();

const blogController = require('../controllers/blogController');
const { uploadBlogImage, resizeImage } = require('../middleware/upload'); // Import
const { getArchivedBlogs, archiveBlog, restoreBlog } = require('../controllers/archiveBlogController');
const { validateBlogCreation, validateBlogUpdate } = require('../middleware/validation');

const ensureAuth = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) return next();
    return res.status(401).json({ message: 'Not authenticated' });
};
router.get('/archives', ensureAuth, getArchivedBlogs); // Get list

// When a user goes to localhost:5000/api/blogs/
router.get('/', blogController.getBlogs);

router.get('/:id', blogController.getBlogById);

router.delete('/:id',
    ensureAuth,
    blogController.deleteBlog
);

router.get('/author/:author', blogController.getBlogByAuthor);

// router.get('/author/:author/drafts', blogController.getDraftsByAuthor);

router.put('/:id',
    ensureAuth,
    uploadBlogImage, // 1. Multer
    resizeImage,     // 2. Sharp
    validateBlogUpdate, // Add validation for update
    blogController.updateBlog
);


// The middleware chain is MANDATORY for multipart/form-data
router.post('/',
    ensureAuth,
    uploadBlogImage, // 1. Multer
    resizeImage,     // 2. Sharp
    validateBlogCreation, // Add validation for creation
    blogController.createBlog
);

// ... other routes


// New Archive Routes
// router.get('/author/archives', ensureAuth, getArchivedBlogs);
router.post('/archive/:id', ensureAuth, archiveBlog);  // Move to archive
router.post('/restore/:id', ensureAuth, restoreBlog); // Move back

module.exports = router;
