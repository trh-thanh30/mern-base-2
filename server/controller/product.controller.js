const Product = require("../models/product.models");

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
    const newProduct = new Product({
      title,
      description,
      price,
      category,
      quantity,
      slug,
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
module.exports = { createProduct };
