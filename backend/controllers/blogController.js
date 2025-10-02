const { Blog } = require("../models");

const getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, tag } = req.query;
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    
    let query = { isPublished: true };
    
    if (search) {
        query.$text = { $search: search };
    }
    
    if (tag) {
        query.tags = { $in: [tag.toLowerCase()] };
    }
    
    console.log("🚀 ~ getAllBlogs ~ query:", query)
    let findQuery = Blog.find(query)
      .populate('authorId', 'name email')
      .select('-__v');
    
    if (search) {
      findQuery = findQuery
        .select({ score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" }, publishedAt: -1 });
    } else {
      findQuery = findQuery.sort({ publishedAt: -1 });
    }
    
    // Execute queries in parallel for better performance
    const [blogs, totalBlogs] = await Promise.all([
      findQuery.skip(skip).limit(limitNum),
      Blog.countDocuments(query)
    ]);
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalBlogs / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;
    
    res.json({
      success: true,
      data: blogs,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalBlogs,
        limit: limitNum,
        hasNextPage,
        hasPrevPage
      },
      filters: {
        search: search || null,
        tag: tag || null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message
    });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findOne({ 
      _id: req.params.id, 
      isPublished: true 
    })
      .populate('authorId', 'name email')
      .populate('likes', 'name email')
      .select('-__v');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
      error: error.message
    });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, description, media, tags } = req.body;

    const blog = new Blog({
      title,
      description,
      media: media || [],
      tags: tags || [],
      authorId: req.user.id
    });

    await blog.save();

    const populatedBlog = await Blog.findById(blog._id)
      .populate('authorId', 'name email')
      .select('-__v');

    res.status(201).json({
      success: true,
      data: populatedBlog,
      message: "Blog created successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create blog",
      error: error.message
    });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    if (blog.authorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own blogs"
      });
    }

    const { title, description, media, tags, isPublished } = req.body;

    if (title !== undefined) blog.title = title;
    if (description !== undefined) blog.description = description;
    if (media !== undefined) blog.media = media;
    if (tags !== undefined) blog.tags = tags;
    if (isPublished !== undefined) blog.isPublished = isPublished;

    await blog.save();

    const updatedBlog = await Blog.findById(blog._id)
      .populate('authorId', 'name email')
      .select('-__v');

    res.json({
      success: true,
      data: updatedBlog,
      message: "Blog updated successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update blog",
      error: error.message
    });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    if (blog.authorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own blogs"
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Blog deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete blog",
      error: error.message
    });
  }
};

const toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    const userId = req.user.id;
    const isLiked = blog.likes.includes(userId);

    if (isLiked) {
      await blog.removeLike(userId);
    } else {
      await blog.addLike(userId);
    }

    const updatedBlog = await Blog.findById(blog._id)
      .populate('authorId', 'name email')
      .populate('likes', 'name email')
      .select('-__v');

    res.json({
      success: true,
      data: updatedBlog,
      message: isLiked ? "Like removed" : "Like added"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to toggle like",
      error: error.message
    });
  }
};

const getUserBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, tag, published } = req.query;
    const userId = req.user.id;
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    
    // Build query for user's blogs
    let query = { authorId: userId };
    
    // Filter by published status if specified
    if (published !== undefined) {
      query.isPublished = published === 'true';
    }
    
    // Add search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    // Add tag filter
    if (tag) {
      query.tags = { $in: [tag.toLowerCase()] };
    }
    
    let findQuery = Blog.find(query)
      .populate('authorId', 'name email')
      .select('-__v');
    
    // Sort by search relevance if searching, otherwise by creation date
    if (search) {
      findQuery = findQuery
        .select({ score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" }, createdAt: -1 });
    } else {
      findQuery = findQuery.sort({ createdAt: -1 });
    }
    
    // Execute queries in parallel for better performance
    const [blogs, totalBlogs] = await Promise.all([
      findQuery.skip(skip).limit(limitNum),
      Blog.countDocuments(query)
    ]);
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalBlogs / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;
    
    res.json({
      success: true,
      data: blogs,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: totalBlogs,
        itemsPerPage: limitNum,
        hasNextPage,
        hasPrevPage
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user blogs",
      error: error.message
    });
  }
};

const getPopularTags = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    // Aggregate to get tag counts from published blogs
    const popularTags = await Blog.aggregate([
      { $match: { isPublished: true } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: parseInt(limit, 10) },
      { $project: { tag: "$_id", count: 1, _id: 0 } }
    ]);

    res.json({
      success: true,
      data: popularTags
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch popular tags",
      error: error.message
    });
  }
};

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLike,
  getUserBlogs,
  getPopularTags
};