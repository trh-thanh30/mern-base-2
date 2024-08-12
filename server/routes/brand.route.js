const express = require("express");
const { createBrand } = require("../controller/brand.controller");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();
router.post("/", verifyToken, createBrand);
module.exports = router;
