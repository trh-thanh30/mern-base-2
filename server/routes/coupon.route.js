const express = require("express");
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
} = require("../controller/coupon.controller");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

router.post("/", verifyToken, createCoupon);
router.get("/", verifyToken, getAllCoupons);
router.put("/:id", verifyToken, updateCoupon);
module.exports = router;
