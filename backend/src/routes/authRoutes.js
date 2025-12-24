const express = require('express'); 

// 5. Auth Routes
const authController = require('../controllers/authController');
const { uploadAvatar, resizeAvatar } = require('../middleware/upload');
const { validateRegistration, validateLogin } = require('../middleware/validation');

const router = express.Router();

const ensureAuth = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) return next();
    return res.status(401).json({ message: 'Not authenticated' });
};

router.post('/signup', validateRegistration, authController.signup);
router.post('/login', validateLogin, authController.login);
router.post('/logout', authController.logout);
router.get('/user', authController.getCurrentUser);
router.put('/user', 
    ensureAuth,
    uploadAvatar, 
    resizeAvatar, 
    authController.updateProfile
);



module.exports = router;
