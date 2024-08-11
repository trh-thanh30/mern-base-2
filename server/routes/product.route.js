const express = require("express");
const {
  createProduct,
  getProduct,
} = require("../controller/product.controller");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();
router.post("/create-product", verifyToken, createProduct);
router.get("/products/:id", getProduct);
module.exports = router;
