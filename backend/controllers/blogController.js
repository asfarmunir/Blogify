const { Blog } = require("../models");

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findPublished()
      .populate('authorId', 'name email')
      .select('-__v');
    
    res.json({
      success: true,
      data: blogs
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

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLike
};