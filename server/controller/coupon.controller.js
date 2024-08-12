const Coupon = require("../models/coupon.models");
const validateMongodbId = require("../utils/validateMongodb");

const createCoupon = async (req, res) => {
  const { role } = req.user;
  if (role !== "admin")
    return res
      .status(401)
      .json({ message: "Unauthorized user admin", success: false });
  const { name, expiry, discount } = req.body;
  if (!name)
    return res
      .status(400)
      .json({ message: "Please provide coupon name", success: false });
  if (!expiry)
    return res
      .status(400)
      .json({ message: "Please provide coupon expiry date", success: false });
  if (!discount)
    return res
      .status(400)
      .json({ message: "Please provide coupon discount", success: false });
  const hasName = await Coupon.findOne({ name });
  if (hasName)
    return res
      .status(400)
      .json({ message: "Coupon already exists", success: false });
  try {
    const newCoupon = await Coupon.create({
      name,
      expiry,
      discount,
    });
    res.status(201).json({
      message: "Coupon created successfully",
      success: true,
      newCoupon,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
const getAllCoupons = async (req, res) => {
  const { role } = req.user;
  if (role !== "admin")
    return res
      .status(401)
      .json({ message: "Unauthorized user admin", success: false });
  try {
    const coupons = await Coupon.find();
    res.status(200).json({ message: "All coupons", success: true, coupons });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
const updateCoupon = async (req, res) => {
  const { role } = req.user;
  if (role !== "admin")
    return res
      .status(401)
      .json({ message: "Unauthorized user admin", success: false });
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "Coupon updated", success: true, updateCoupon });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
const deleteCoupon = async (req, res) => {
  const { role } = req.user;
  if (role !== "admin")
    return res
      .status(401)
      .json({ message: "Unauthorized user admin", success: false });
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteCoupon = await Coupon.findByIdAndDelete(id);
    res
      .status(204)
      .json({ message: "Coupon deleted", success: true, deleteCoupon });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
module.exports = { createCoupon, getAllCoupons, updateCoupon, deleteCoupon };
