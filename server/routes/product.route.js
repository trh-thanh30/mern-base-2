const express = require("express");
const { createProduct } = require("../controller/product.controller");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();
router.post("/create-product", verifyToken, createProduct);
module.exports = router;
