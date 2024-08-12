const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter blog title"],
    },
    description: {
      type: String,
      required: [true, "Please enter blog description"],
    },
    category: {
      type: String,
      required: [true, "Please enter blog category"],
    },
    numViews: {
      type: Number,
      default: 0,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isDisliked: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    image: {
      type: String,
      default:
        "https://cloud.z.com/vn/wp-content/uploads/2023/11/how-to-write-a-blog-post.jpeg",
    },
    author: {
      type: String,
      default: "Admin",
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
