const express = require("express");
const {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  disLikeBlog,
} = require("../controller/blog.controller");
const verifyToken = require("../middlewares/verifyToken");
const cloudinaryFileUploader = require("../middlewares/uploadImage");
const router = express.Router();
router.post(
  "/create-blog",
  verifyToken,
  cloudinaryFileUploader.array("images", 10),
  createBlog
);
router.put("/update-blog/:id", verifyToken, updateBlog);
router.get("/:id", getBlog);
router.get("/", getAllBlogs);
router.delete("/:id", verifyToken, deleteBlog);
router.put("/likes", verifyToken, likeBlog);
router.put("/dislikes", verifyToken, disLikeBlog);

module.exports = router;
