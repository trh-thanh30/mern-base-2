const express = require("express");
const { createCategory } = require("../controller/category.controller");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();
router.post("/create-category", verifyToken, createCategory);
module.exports = router;
