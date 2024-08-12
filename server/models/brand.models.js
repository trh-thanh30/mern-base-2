const mongoose = require("mongoose");
const brandSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter brand title"],
    unique: [true, "Brand already exists"],
    index: true,
  },
});

const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;
