const User = require("../models/user.models");
const bcryptjs = require("bcryptjs");
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
module.exports = { registerUser };
