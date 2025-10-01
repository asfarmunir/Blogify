const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLike
} = require("../controllers/blogController");

router.get("/", getAllBlogs);
router.get("/:id", getBlogById);

router.post("/", auth, createBlog);
router.put("/:id", auth, updateBlog);
router.delete("/:id", auth, deleteBlog);

router.post("/:id/like", auth, toggleLike);

module.exports = router;