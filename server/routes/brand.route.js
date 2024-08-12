const express = require("express");
const {
  createBrand,
  updateBrand,
  deleteBrand,
  getAllBrand,
  getBrand,
} = require("../controller/brand.controller");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();
router.post("/", verifyToken, createBrand);
router.put("/:id", verifyToken, updateBrand);
router.delete("/:id", verifyToken, deleteBrand);
router.get("/:id", getBrand);
router.get("/", getAllBrand);

module.exports = router;
