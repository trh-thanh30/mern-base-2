const Category = require("../models/category.models");
const validateMongodbId = require("../utils/validateMongodb");
const createCategory = async (req, res) => {
  const { title } = req.body;
  const { role } = req.user;
  if (role !== "admin")
    return res.status(401).json({
      message: "Unauthorized user admin",
      success: false,
    });
  if (!title)
    return res
      .status(400)
      .json({ message: "Please enter category title", success: false });
  const hasTitle = await Category.findOne({ title });
  if (hasTitle)
    return res
      .status(403)
      .json({ message: "Category already exists", success: false });
  try {
    const newCategory = new Category({ title });
    await newCategory.save();
    res.status(201).json({
      message: "Category created successfully",
      success: true,
      newCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = { createCategory };
