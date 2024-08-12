const mongoose = require("mongoose");
const blogCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter blog category title"],
    unique: [true, "Blog category already exists"],
    index: true,
  },
});
const BlogCategory = mongoose.model("BlogCategory", blogCategorySchema);
module.exports = BlogCategory;
