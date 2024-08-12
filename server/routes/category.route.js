const express = require("express");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
} = require("../controller/category.controller");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();
router.post("/create-category", verifyToken, createCategory);
router.put("/update-category/:id", verifyToken, updateCategory);
router.delete("/:id", verifyToken, deleteCategory);
router.get("/:id", getCategory);
module.exports = router;
