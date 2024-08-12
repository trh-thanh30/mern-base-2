const Brand = require("../models/brand.models");

const createBrand = async (req, res) => {
  const { role } = req.user;
  if (role !== "admin") {
    return res
      .status(401)
      .json({ message: "Unauthorized user admin", success: false });
  }
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Please enter title" });
  const hasTitle = await Brand.findOne({ title });
  if (hasTitle)
    return res
      .status(403)
      .json({ message: "Brand already exists", success: false });
  try {
    const newBrand = await Brand.create({ title });
    res.status(200).json(newBrand);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = { createBrand };
