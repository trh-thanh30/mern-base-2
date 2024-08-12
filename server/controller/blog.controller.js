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
module.exports = { createBlog };
