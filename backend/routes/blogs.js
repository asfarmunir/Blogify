const express = require("express");
const router = express.Router();
const {authenticate} = require("../middleware/auth");
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLike,
  getPopularTags
} = require("../controllers/blogController");

router.get("/", getAllBlogs);
router.get("/tags/popular", getPopularTags);
router.get("/:id", getBlogById);

router.post("/", authenticate, createBlog);
router.put("/:id", authenticate, updateBlog);
router.delete("/:id", authenticate, deleteBlog);

router.post("/:id/like", authenticate, toggleLike);

module.exports = router;