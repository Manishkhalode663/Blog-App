const { body, validationResult } = require('express-validator');

const validateRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateLogin = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateBlogCreation = [
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters long'),
  body('content').trim().isLength({ min: 50 }).withMessage('Content must be at least 50 characters long'),
  body('category').notEmpty().withMessage('Category is required'),
  body('readTime').notEmpty().withMessage('Read time is required'),
  body('tags').isArray({ min: 1 }).withMessage('At least one tag is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateBlogUpdate = [
  body('title').optional().trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters long'),
  body('content').optional().trim().isLength({ min: 50 }).withMessage('Content must be at least 50 characters long'),
  body('category').optional().notEmpty().withMessage('Category is required'),
  body('readTime').optional().notEmpty().withMessage('Read time is required'),
  body('tags').optional().isArray({ min: 1 }).withMessage('At least one tag is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateBlogCreation,
  validateBlogUpdate,
};