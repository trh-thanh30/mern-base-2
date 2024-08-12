const express = require("express");
const { createCoupon } = require("../controller/coupon.controller");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

router.post("/", verifyToken, createCoupon);
module.exports = router;
