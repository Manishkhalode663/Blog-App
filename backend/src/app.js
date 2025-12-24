// 1. Import core modules and route handlers
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config(); 
 

const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/authRoutes');
const initScheduledJobs = require('./cron-jobs/blog-schedule');

// 2. Configure Passport (pass instance for setup)
require('./config/passport')(passport);

// 3. Constants and app instance
const PORT = process.env.PORT || 5000;
const app = express();

// 4. CORS setup (required for cookies/sessions)
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174').split(',');
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    return callback(null, allowedOrigins.includes(origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// 5. Body parsers
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 6. Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_secret_key_here',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
  })
);

// 7. Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Adjust path as needed

// 8. API routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// 9. Connect to MongoDB ('blog-website' database)
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blog-website',{
    retryWrites: false,
  })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    initScheduledJobs();
  })
  .catch((err) => console.error('❌ Connection error:', err));



// 10. Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
