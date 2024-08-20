const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUser,
  getUserById,
  deleteUserBydId,
  updateUser,
  blockUser,
  unBlockUser,
  logout,
  loginAdmin,
  getWishList,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
} = require("../controller/user.controller");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin-login", loginAdmin);
router.get("/users", getAllUser);
router.get("/user/:id", verifyToken, getUserById);
router.post("/cart", verifyToken, userCart);
router.post("/cart/applycoupon", verifyToken, applyCoupon);
router.post("/cart/cash-order", verifyToken, createOrder);
router.get("/wish-list", verifyToken, getWishList);
router.delete("/empty-cart", verifyToken, emptyCart);
router.get("/cart-user", verifyToken, getUserCart);
router.put("/address", verifyToken, saveAddress);
router.delete("/delete-user/:id", deleteUserBydId);
router.put("/update-user", verifyToken, updateUser);
router.put("/block-user/:id", verifyToken, blockUser);
router.put("/unblock-user/:id", verifyToken, unBlockUser);
router.get("/logout", logout);
module.exports = router;
