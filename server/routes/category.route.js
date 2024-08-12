const express = require("express");
const {
  createCategory,
  updateCategory,
} = require("../controller/category.controller");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();
router.post("/create-category", verifyToken, createCategory);
router.put("/update-category/:id", verifyToken, updateCategory);
module.exports = router;
