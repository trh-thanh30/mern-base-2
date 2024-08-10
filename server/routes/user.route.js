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
} = require("../controller/user.controller");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", getAllUser);
router.get("/user/:id", verifyToken, getUserById);
router.delete("/delete-user/:id", deleteUserBydId);
router.put("/update-user", verifyToken, updateUser);
router.put("/block-user/:id", verifyToken, blockUser);
router.put("/unblock-user/:id", verifyToken, unBlockUser);
module.exports = router;
