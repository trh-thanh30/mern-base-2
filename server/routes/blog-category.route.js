const express = require("express");
const {
  createCategoryBlog,
  updateCategoryBlog,
  deleteCategoryBlog,
  getCategoryBlog,
  getAllCategoryBlog,
} = require("../controller/blog-category.controller");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();
router.post("/create-blog-category", verifyToken, createCategoryBlog);
router.put("/update-category/:id", verifyToken, updateCategoryBlog);
router.delete("/:id", verifyToken, deleteCategoryBlog);
router.get("/:id", getCategoryBlog);
router.get("/", getAllCategoryBlog);
module.exports = router;
