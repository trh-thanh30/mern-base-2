const express = require("express");
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} = require("../controller/coupon.controller");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

router.post("/", verifyToken, createCoupon);
router.get("/", verifyToken, getAllCoupons);
router.put("/:id", verifyToken, updateCoupon);
router.delete("/:id", verifyToken, deleteCoupon);
module.exports = router;
