const express = require("express");
const { registerUser, loginUser, getAllUser } = require("../controller/user.controller");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", getAllUser);
module.exports = router;
