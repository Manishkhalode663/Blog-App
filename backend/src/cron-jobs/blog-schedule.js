const cron = require('node-cron');
const Blog = require('../models/Blog'); // Adjust path to your Blog model

const initScheduledJobs = () => {
  // Schedule task to run every minute
  // Cron Syntax: * * * * * (Minute, Hour, Day of Month, Month, Day of Week)
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();

      // 1. Find and Update
      // We look for blogs that are 'scheduled' AND their time has passed (less than or equal to now)
      const result = await Blog.updateMany(
        {
          status: 'scheduled',
          scheduledAt: { $lte: now } // $lte = Less Than or Equal
        },
        {
          $set: {
            status: 'published', 
            publishedAt: now,
            // Optional: You can keep scheduledAt as the publish date, 
            // or clear it if you strictly want it for scheduling only.
            // scheduledAt: null 
          }
        }
      );

      // Only log if something actually happened to avoid console clutter
      if (result.modifiedCount > 0) {
        console.log(`⏰ Cron Job: Automatically published ${result.modifiedCount} blog(s) at ${now.toISOString()}`);
      }else{
        // console.log(`⏰ Cron Job: No blogs to publish at ${now.toISOString()}`);
      }

    } catch (error) {
      console.error('❌ Cron Job Error:', error);
    }
  });

  console.log('✅ Scheduler Service Initialized');
};

module.exports = initScheduledJobs;