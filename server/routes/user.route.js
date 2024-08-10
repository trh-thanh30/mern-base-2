const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUser,
  getUserById,
  deleteUserBydId,
  updateUser,
} = require("../controller/user.controller");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", getAllUser);
router.get("/user/:id", verifyToken, getUserById);
router.delete("/delete-user/:id", deleteUserBydId);
router.put("/update-user/:id", updateUser);
module.exports = router;
