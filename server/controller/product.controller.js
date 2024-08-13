const Product = require("../models/product.models");
const slugify = require("slugify");
const User = require("../models/user.models");
const validateMongodbId = require("../utils/validateMongodb");
const cloudinaryUploadImg = require("../utils/cloudinary");
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
    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    let query = Product.find(JSON.parse(queryString));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }
    // pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("Page not found");
    }
    const products = await query;
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
const deleteProduct = async (req, res) => {
  const { role } = req.user;
  const { id } = req.params;
  if (role !== "admin")
    return res
      .status(401)
      .json({ message: "Unauthorized user admin", success: false });
  try {
    const deleteProduct = await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
const addToWishList = async (req, res) => {
  const { id } = req.user;
  const { productId } = req.body;
  try {
    const user = await User.findById(id);
    const alreadyAdded = user.wishlist.find(
      (id) => id.toString() === productId
    );
    if (alreadyAdded) {
      let user = await User.findByIdAndUpdate(
        id,
        {
          $pull: { wishlist: productId },
        },
        { new: true }
      );
      res.status(200).json({
        message: "Product removed from wishlist",
        success: true,
      });
    } else {
      let user = await User.findByIdAndUpdate(
        id,
        {
          $push: {
            wishlist: productId,
          },
        },
        {
          new: true,
        }
      );
      res.status(200).json({
        message: "Product added to wishlist",
        success: true,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
const rating = async (req, res) => {
  const { id } = req.user;
  const { star, productId, comment } = req.body;
  try {
    const product = await Product.findById(productId);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === id.toString()
    );
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: {
            $elemMatch: alreadyRated,
          },
        },
        {
          $set: {
            "ratings.$.star": star,
            "ratings.$.comment": comment,
          },
        },
        {
          new: true,
        }
      );
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        productId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: id,
            },
          },
        },
        { new: true }
      );
    }
    const getallrating = await Product.findById(productId);
    let totalRating = getallrating.ratings.length;
    let ratingsum = getallrating.ratings
      .map((item) => item.star)
      .reduce((a, b) => a + b, 0);
    let actualRating = Math.round(ratingsum / totalRating);
    let finalproduct = await Product.findByIdAndUpdate(
      productId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );
    res.json(finalproduct);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const uploadImages = async (req, res) => {
  const { role } = req.user;
  if (role !== "admin")
    return res.status(401).json({ message: "unauthorized" });
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);
    }
    const findProducts = await Product.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      { new: true }
    );
    res.json(findProducts);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishList,
  rating,
  uploadImages,
};
