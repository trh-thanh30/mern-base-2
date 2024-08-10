const express = require("express");
const { registerUser, loginUser, getAllUser, getUserById } = require("../controller/user.controller");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", getAllUser);
router.get("/user/:id", getUserById);
module.exports = router;
