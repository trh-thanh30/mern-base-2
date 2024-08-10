const User = require("../models/user.models");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, mobile } = req.body;
    if (!firstname)
      return res
        .status(400)
        .json({ message: "Please enter your first name", success: false });
    if (!lastname)
      return res
        .status(400)
        .json({ message: "Please enter your last name", success: false });
    if (!email)
      return res
        .status(400)
        .json({ message: "Please enter your email", success: false });
    if (!password)
      return res
        .status(400)
        .json({ message: "Please enter your password", success: false });
    if (!mobile)
      return res
        .status(400)
        .json({ message: "Please enter your mobile number", success: false });
    const hasUser = await User.findOne({ email });
    if (hasUser)
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      mobile,
    });
    await newUser.save();
    return res
      .status(200)
      .json({ message: "User created successfully", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ message: "Please enter your email", success: false });
    if (!password) {
      return res
        .status(400)
        .json({ message: "Please enter your password", success: false });
    }
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    const isMatch = bcryptjs.compareSync(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    const expiryDate = new Date(Date.now() + 3600000);
    const { password: hashedPassword, ...rest } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: expiryDate,
      })
      .status(200)
      .json(rest);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
module.exports = { registerUser, loginUser, getAllUser, getUserById };
