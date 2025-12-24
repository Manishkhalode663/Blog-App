const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const ArchivedBlog = require('../models/ArchivedBlog');

// 1. Move to Archive
const archiveBlog = async (req, res) => {
  const session = await mongoose.startSession(); 

  try {
    const { id } = req.params;

    // A. Find the original blog
    const blog = await Blog.findById(id).session(session);
    if (!blog) { 
      return res.status(404).json({ message: 'Blog not found' });
    }

    // B. Prepare data for Archive
    const blogData = blog.toObject();
    
    console.log( "OLD blogData:",blogData);
    // Map original _id to originalId and remove _id to let Mongo generate a new one for the archive
    const archivePayload = {
      ...blogData,
      originalId: blog._id,
      originalCreatedAt: blog.createdAt,
      originalUpdatedAt: blog.updatedAt,
      archivedBy: req.user.username, // Assuming you have middleware adding user to req
      _id: undefined, // Remove _id so a new unique ID is created for the archive
    };

    // C. Create entry in ArchivedBlog
    await ArchivedBlog.create([archivePayload], { session });

    // D. Delete from main Blog collection
    await Blog.findByIdAndDelete(id).session(session);

    // E. Commit the transaction (Make changes permanent)
     
    res.json({ message: 'Blog moved to archive successfully' });

  } catch (error) {
    // F. Rollback if anything fails 
    console.error("Archive Error:", error);
    res.status(500).json({ message: 'Failed to archive blog' });
  } finally {
    session.endSession();
  }
};

// 2. Restore from Archive
const restoreBlog = async (req, res) => {
  const session = await mongoose.startSession(); 

  try {
    const { id } = req.params; // This is the ID in the Archive Table

    // A. Find the archived blog
    const archivedBlog = await ArchivedBlog.findById(id).session(session);
    if (!archivedBlog) { 
      return res.status(404).json({ message: 'Archived blog not found' });
    }

    // B. Prepare data for Restoration
    const restoreData = archivedBlog.toObject();
    
    // Use the stored originalId as the _id to keep URLs consistent
    const blogPayload = {
        ...restoreData,
        _id: restoreData.originalId, // Restore the original ID
        createdAt: restoreData.originalCreatedAt,
        updatedAt: new Date(), // Update time to now
        status: 'draft', // Safety: Restore as draft first
        // Remove archive specific fields
        originalId: undefined,
        archivedAt: undefined,
        archivedBy: undefined,
        originalCreatedAt: undefined,
        originalUpdatedAt: undefined
    };

    // C. Insert back into main Blog collection
    await Blog.create([blogPayload], { session });

    // D. Delete from Archive collection
    await ArchivedBlog.findByIdAndDelete(id).session(session);

    // E. Commit 
    res.json({ message: 'Blog restored successfully' });

  } catch (error) { 
    console.error("Restore Error:", error);
    // Handle duplicate key error (if ID already exists somehow)
    if (error.code === 11000) {
        res.status(400).json({ message: 'A blog with this ID already exists in active blogs.' });
    } else {
        res.status(500).json({ message: 'Failed to restore blog' });
    }
  } finally {
    session.endSession();
  }
};

// 3. Get Archived Blogs
const getArchivedBlogs = async (req, res) => {
    try {
        // console.log("req.user.username");
        const archives = await ArchivedBlog.find({ archivedBy: req.user.username })
                                           .sort({ archivedAt: -1 });
        // console.log(archives);
        res.json(archives);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { archiveBlog, restoreBlog, getArchivedBlogs };