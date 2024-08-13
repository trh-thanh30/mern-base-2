const express = require("express");
const {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  disLikeBlog,
  uploadImages,
} = require("../controller/blog.controller");
const verifyToken = require("../middlewares/verifyToken");
const { uploadPhoto, blogImgResize } = require("../middlewares/uploadImage");
const router = express.Router();
router.post("/create-blog", verifyToken, createBlog);
router.put("/update-blog/:id", verifyToken, updateBlog);
router.get("/:id", getBlog);
router.get("/", getAllBlogs);
router.delete("/:id", verifyToken, deleteBlog);
router.put("/likes", verifyToken, likeBlog);
router.put("/dislikes", verifyToken, disLikeBlog);
router.put(
  "/upload/:id",
  verifyToken,
  uploadPhoto.array("images", 10),
  blogImgResize,
  uploadImages
);
module.exports = router;
