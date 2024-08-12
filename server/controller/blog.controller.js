const Blog = require("../models/blog.models");
const validateMongodbId = require("../utils/validateMongodb");

const createBlog = async (req, res) => {
  const { role } = req.user;
  const { title, description, category } = req.body;
  if (!title)
    return res
      .status(400)
      .json({ message: "Please enter blog title", success: false });
  if (!description)
    return res
      .status(400)
      .json({ message: "Please enter blog description", success: false });
  if (!category)
    return res
      .status(400)
      .json({ message: "Please enter blog category", success: false });
  if (role !== "admin")
    return res
      .status(401)
      .json({ message: "Unauthorized user admin", success: false });
  try {
    const newBlog = await Blog.create(req.body);
    res.status(200).json({ message: "Blog created", success: true, newBlog });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
const updateBlog = async (req, res) => {
  const { role } = req.user;
  const { id } = req.params;
  validateMongodbId(id);
  if (role !== "admin")
    return res
      .status(401)
      .json({ message: "Unauthorized user admin", success: false });
  try {
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "Blog updated", success: true, updateBlog });
  } catch (error) {
    res.status(403).json({ message: "Blog not found", success: false });
  }
};
const getBlog = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const blog = await Blog.findById(id);
    const updateViews = await Blog.findByIdAndUpdate(
      id,
      { $inc: { numViews: 1 } },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Blog found", success: true, updateViews });
  } catch (error) {
    return res.status(404).json({ message: error.message, success: false });
  }
};
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    return res
      .status(200)
      .json({ message: "Blogs found", success: true, blogs });
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};
const deleteBlog = async (req, res) => {
  const { role } = req.user;
  const { id } = req.params;
  validateMongodbId(id);
  if (role !== "admin")
    return res.status(401).json({ message: "Unauthorized" });
  try {
    const deleteBlog = await Blog.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ message: "Blog deleted", success: true, deleteBlog });
  } catch (error) {
    return res.status(403).json({ message: "Blog not found", success: false });
  }
};
const likeBlog = async (req, res) => {
  const { blogId } = req.body;
  validateMongodbId(blogId);

  // Find the blog which you want to liked
  const blog = await Blog.findById(blogId);
  // Find the login user
  const loginUserId = req?.user?._id;
  // Find if the user has liked the blog
  const isLiked = blog?.isLiked;
  // Find the user has dislike the blog
  const alreadyDisLiked = blog?.dislikes?.find(
    (userId = userId?.toString() === loginUserId?.toString())
  );
  if (alreadyDisLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );

    res.status(200).json(blog);
  }

  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.status(200).json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.status(200).json(blog);
  }
};
module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
};
