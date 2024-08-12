const express = require("express");
const { createBlog } = require("../controller/blog.controller");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();
router.post("/create-blog", verifyToken, createBlog);

module.exports = router;
