const Product = require("../models/product.models");
const slugify = require("slugify");
const createProduct = async (req, res) => {
  const { role } = req.user;
  if (role !== "admin") {
    return res
      .status(401)
      .json({ message: "Unauthorized user admin", success: false });
  }
  try {
    const {
      title,
      description,
      price,
      category,
      quantity,
      images,
      color,
      ratings,
      brand,
      sold,
      slug,
    } = req.body;
    if (!title)
      return res
        .status(400)
        .json({ message: " Please enter product title", success: false });
    if (!description)
      return res
        .status(400)
        .json({ message: "Please enter product description", success: false });
    if (!price)
      return res
        .status(400)
        .json({ message: "Please enter product price", success: false });
    if (!quantity)
      return res
        .status(400)
        .json({ message: "Please enter product quantity", success: false });
    if (!category)
      return res
        .status(400)
        .json({ message: "Please enter product category", success: false });
    if (!color)
      return res
        .status(400)
        .json({ message: "Please enter product color", success: false });
    if (!brand)
      return res
        .status(400)
        .json({ message: "Please enter product brand", success: false });
    const newProduct = new Product({
      title,
      description,
      price,
      category,
      quantity,
      slug: slug || slugify(title),
      images,
      color,
      ratings,
      brand,
      sold,
      userId: req.user.id,
    });
    await newProduct.save();
    res
      .status(200)
      .json({ message: "Product created", product: newProduct, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id);
    res.status(200).json(findProduct);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
const updateProduct = async (req, res) => {
  const { role } = req.user;
  const { id } = req.params;
  if (role !== "admin")
    return res
      .status(401)
      .json({ message: "Unauthorized user admin", success: false });
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await Product.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updateProduct);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
module.exports = { createProduct, getProduct, getAllProduct, updateProduct };
