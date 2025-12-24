const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// 1. Ensure upload directories exist
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Multer Storage (Use MemoryStorage for Sharp processing)
const storage = multer.memoryStorage();

// 3. File Filter (Reject non-images)
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

// 4. Initialize Multer
const upload = multer({
    storage: storage,
    fileFilter: multerFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit to 5MB
});

// --- Middleware Wrappers ---

// A. Middleware to upload a single file named 'image' (for Blogs)
exports.uploadBlogImage = upload.single('image');

// B. Middleware to upload a single file named 'avatar' (for Profiles)
exports.uploadAvatar = upload.single('avatar');


// --- Sharp Processing Middleware ---

// C. Resize and Save Image
exports.resizeImage = async (req, res, next) => {
    if (!req.file) return next();

    // Generate unique filename
    const filename = `blog-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpeg`;
    
    // Define file path
    const outputPath = path.join('uploads', filename);

    try {
        await sharp(req.file.buffer)
            .resize(800, 600, { // Resize logic
                fit: 'cover',
                position: 'center'
            })
            .toFormat('jpeg')
            .jpeg({ quality: 90 }) // Compress quality
            .toFile(outputPath);

        // Attach filename to req.body so the Controller can save it to DB
        // We construct the full URL (assuming you serve static files from /uploads)
        req.body.image = `http://localhost:5000/uploads/${filename}`;
        
        next();
    } catch (error) {
        console.error("Sharp Error:", error);
        return res.status(500).json({ message: 'Error processing image' });
    }
};

// D. Resize Avatar (Smaller dimensions)
exports.resizeAvatar = async (req, res, next) => {
    if (!req.file) return next();

    const filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    const outputPath = path.join('uploads', filename);

    try {
        await sharp(req.file.buffer)
            .resize(300, 300, { // Square crop for avatars
                fit: 'cover',
                position: 'center'
            })
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(outputPath);

        // Attach to req.body for the controller
        req.body.avatar = `http://localhost:5000/uploads/${filename}`;
        
        next();
    } catch (error) {
        console.error("Sharp Avatar Error:", error);
        return res.status(500).json({ message: 'Error processing avatar' });
    }
};