const User = require("../models/user.models");
const bcryptjs = require("bcryptjs");
const validateMongodbId = require("../utils/validateMongodb");
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

// logIn User
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

// logIn Admin
const loginAdmin = async (req, res) => {
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
    const admin = await User.findOne({ email });
    if (admin.role !== "admin") throw new Error("Not Authorized");
    if (!admin)
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    const isMatch = bcryptjs.compareSync(password, admin.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET
    );
    const expiryDate = new Date(Date.now() + 3600000);
    const { password: hashedPassword, ...rest } = admin._doc;
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
  const { role } = req.user;
  if (role !== "admin")
    return res
      .status(401)
      .json({ message: "Unauthorized user admin", success: false });
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const deleteUserBydId = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await User.findByIdAndDelete(id);
    res.status(200).json(deleteUser);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
const updateUser = async (req, res) => {
  try {
    const { id } = req.user;
    validateMongodbId(id);
    const { firstname, lastname, email, mobile } = req.body;
    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          firstname,
          lastname,
          email,
          mobile,
        },
      },
      { new: true }
    );
    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
const blockUser = async (req, res) => {
  const { role } = req.user;
  if (role !== "admin")
    return res
      .status(401)
      .json({ message: "Unauthorized user admin", success: false });
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const blockUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          isBlocked: true,
        },
      },
      { new: true }
    );
    res.status(200).json({ message: "User blocked", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
const unBlockUser = async (req, res) => {
  const { role } = req.user;
  if (role !== "admin")
    return res
      .status(401)
      .json({ message: "Unauthorized user admin", success: false });
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const unBlockUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          isBlocked: false,
        },
      },
      { new: true }
    );
    res.status(200).json({ message: "User unblocked", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
const logout = (req, res) => {
  try {
    res
      .clearCookie("access_token", {
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .json({ message: "Logout success" });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
const getWishList = async (req, res) => {
  const { id } = req.user;
  try {
    const findUser = await User.findById(id).populate("wishlist");
    res.status(200).json(findUser);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
// save user address
const saveAddress = async (req, res) => {
  const { id } = req.user;
  try {
    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        address: req?.body?.address,
      },
      { new: true }
    );
    res.status(200).json(updateUser);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUser,
  getUserById,
  deleteUserBydId,
  updateUser,
  blockUser,
  unBlockUser,
  logout,
  loginAdmin,
  getWishList,
  saveAddress,
};
