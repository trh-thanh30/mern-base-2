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
const updateCategory = async (req, res) => {
  const { role } = req.user;
  const { id } = req.params;
  if (role !== "admin")
    return res
      .status(401)
      .json({ message: "Unauthorized user admin", success: false });
  validateMongodbId(id);
  try {
    const updateCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res
      .status(200)
      .json({ message: "Category updated successfully", updateCategory });
  } catch (error) {
    return res.status(400).json({ message: error.message, success: false });
  }
};
const deleteCategory = async (req, res) => {
  const { role } = req.user;
  const { id } = req.params;
  if (role !== "admin")
    return res
      .status(401)
      .json({ message: "Unauthorized user admin", success: false });
  validateMongodbId(id);
  try {
    const deleteCategory = await Category.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ message: "Category deleted successfully", deleteCategory });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};
const getCategory = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const getCategory = await Category.findById(id);
    return res.status(200).json({ getCategory });
  } catch (error) {
    return res.status(400).json({ message: error.message, success: false });
  }
};
module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
};
