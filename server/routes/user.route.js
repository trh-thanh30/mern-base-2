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
} = require("../controller/user.controller");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin-login", loginAdmin);
router.get("/users", getAllUser);
router.get("/user/:id", verifyToken, getUserById);
router.get("/wish-list", verifyToken, getWishList);
router.delete("/delete-user/:id", deleteUserBydId);
router.put("/update-user", verifyToken, updateUser);
router.put("/block-user/:id", verifyToken, blockUser);
router.put("/unblock-user/:id", verifyToken, unBlockUser);
router.get("/logout", logout);
module.exports = router;
