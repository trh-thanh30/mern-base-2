const User = require("../models/user.models");
const bcryptjs = require("bcryptjs");
const validateMongodbId = require("../utils/validateMongodb");
const jwt = require("jsonwebtoken");
const Product = require("../models/product.models");
const Cart = require("../models/cart.models");
const Coupon = require("../models/coupon.models");
const Order = require("../models/order.models");
const uniqid = require("uniqid");
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

const userCart = async (req, res) => {
  const { cart } = req.body;
  const { id } = req.user;
  try {
    let products = [];
    const user = await User.findById(id);
    // check if user already have product in cart
    const alreadyExistCart = await Cart.findOne({
      orderby: user.id,
    });
    if (alreadyExistCart) {
      alreadyExistCart.remove();
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.type = cart[i].color;
      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    let newCart = new Cart({
      products,
      cartTotal,
      orderby: user.id,
    });
    await newCart.save();
    res.status(201).json(newCart);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
const getUserCart = async (req, res) => {
  const { id } = req.user;
  try {
    const cart = await Cart.findOne({ orderby: id }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
const emptyCart = async (req, res) => {
  const { id } = req.user;
  console.log(id);
  try {
    const user = await User.findById(id);
    const cart = await Cart.findOneAndReplace({ orderby: user.id });
    res.json(cart);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};
const applyCoupon = async (req, res) => {
  const { coupon } = req.body;
  const { id } = req.user;

  // Tìm coupon hợp lệ
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (!validCoupon) return res.status(400).json({ message: "Invalid coupon" });

  // Tìm người dùng theo ID
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Tìm giỏ hàng của người dùng
  const cart = await Cart.findOne({ orderby: user._id }).populate(
    "products.product"
  );
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  let { products, cartTotal } = cart;

  // Tính toán tổng sau khi giảm giá
  let totalAfterDiscount = (cartTotal * validCoupon.discount) / 100;

  // Cập nhật giỏ hàng với tổng sau khi giảm giá
  await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAfterDiscount },
    { new: true }
  );

  // Trả về kết quả
  res.json(totalAfterDiscount);
};

const createOrder = async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { id } = req.user;

  try {
    if (!COD) return res.status(400).json({ message: "Something went wrong" });
    const user = await User.findById(id);
    let userCart = await Cart.findOne({ orderby: user._id });
    let finalAmout = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmout = userCart.totalAfterDiscount;
    } else {
      finalAmout = userCart.cartTotal;
    }
    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmout,
        status: "Cash On Delivery",
        created: Date.now(),
        currency: "usd",
      },
      orderStatus: "Cash On Delivery",
      orderby: user.id,
    }).save();
    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });
    const updated = await Product.bulkWrite(update, {});
    res.json({ message: "Order placed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const getOrder = async (req, res) => {
  const { id } = req.user;
  try {
    const order = await Order.findOne({ orderby: id }).populate(
      "products.product"
    );
    res.json(order);
  } catch (error) {
    return res.staus(500).json({ message: error.message, success: false });
  }
};
const orderStatus = async (req, res) => {
  const { role } = req.user;
  if (role !== "admin") return res.status(400).json({ message: "Admin only" });
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus: status },
      {
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    );
    res.json(order);
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
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrder,
  orderStatus,
};
