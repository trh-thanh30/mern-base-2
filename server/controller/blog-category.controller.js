const BlogCategory = require("../models/blog-category.models");
const validateMongodbId = require("../utils/validateMongodb");
const createCategoryBlog = async (req, res) => {
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
  const hasTitle = await BlogCategory.findOne({ title });
  if (hasTitle)
    return res
      .status(403)
      .json({ message: "Category already exists", success: false });
  try {
    const newCategory = new BlogCategory({ title });
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
const updateCategoryBlog = async (req, res) => {
  const { role } = req.user;
  const { id } = req.params;
  if (role !== "admin")
    return res
      .status(401)
      .json({ message: "Unauthorized user admin", success: false });
  validateMongodbId(id);
  try {
    const updateCategory = await BlogCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res
      .status(200)
      .json({ message: "Category updated successfully", updateCategory });
  } catch (error) {
    return res.status(400).json({ message: error.message, success: false });
  }
};
const deleteCategoryBlog = async (req, res) => {
  const { role } = req.user;
  const { id } = req.params;
  if (role !== "admin")
    return res
      .status(401)
      .json({ message: "Unauthorized user admin", success: false });
  validateMongodbId(id);
  try {
    const deleteCategory = await BlogCategory.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ message: "Category deleted successfully", deleteCategory });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};
const getCategoryBlog = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const getCategory = await BlogCategory.findById(id);
    return res.status(200).json({ getCategory });
  } catch (error) {
    return res.status(400).json({ message: error.message, success: false });
  }
};
const getAllCategoryBlog = async (req, res) => {
  try {
    const getallCategory = await BlogCategory.find();
    return res.status(200).json(getallCategory);
  } catch (error) {
    return res.status(400).json({ message: error.message, success: false });
  }
};
module.exports = {
  createCategoryBlog,
  updateCategoryBlog,
  deleteCategoryBlog,
  getCategoryBlog,
  getAllCategoryBlog,
};
