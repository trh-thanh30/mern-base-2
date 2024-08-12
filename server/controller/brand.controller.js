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
const getAllBrand = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
const updateBrand = async (req, res) => {
  const { role } = req.user;
  if (role !== "admin") {
    return res
      .status(401)
      .json({ message: "Unauthorized user admin", success: false });
  }
  const { id } = req.params;
  try {
    const updateBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updateBrand);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
const deleteBrand = async (req, res) => {
  const { role } = req.user;
  if (role !== "admin") {
    return res
      .status(401)
      .json({ message: "Unauthorized user admin", success: false });
  }
  const { id } = req.params;
  try {
    const deleteBrand = await Brand.findByIdAndDelete(id);
    res.status(200).json(deleteBrand);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const getBrand = async (req, res) => {
  const { id } = req.params;
  try {
    const brand = await Brand.findById(id);
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
module.exports = {
  createBrand,
  getAllBrand,
  updateBrand,
  deleteBrand,
  getBrand,
};
