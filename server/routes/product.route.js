const express = require("express");
const {
  createProduct,
  getProduct,
  getAllProduct,
} = require("../controller/product.controller");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();
router.post("/create-product", verifyToken, createProduct);
router.get("/product/:id", getProduct);
router.get("/products", getAllProduct);
module.exports = router;
