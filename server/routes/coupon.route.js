const express = require("express");
const {
  createCoupon,
  getAllCoupons,
} = require("../controller/coupon.controller");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

router.post("/", verifyToken, createCoupon);
router.get("/", getAllCoupons);
module.exports = router;
