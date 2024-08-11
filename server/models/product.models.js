const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter product title"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Please enter product description"],
    },
    price: {
      type: Number,
      required: [true, "Please enter product price"],
      min: 0,
    },
    category: {
      type: String,
      required: [true, "Please enter product category"],
    },
    quantity: {
      type: Number,
      required: [true, "Please enter product quantity"],
      min: 0,
    },
    images: {
      type: Array,
      default: [],
    },
    color: {
      type: String,
      required: [true, "Please enter product color"],
    },
    ratings: [
      {
        star: Number,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    brand: {
      type: String,
      required: [true, "Please enter product brand"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
