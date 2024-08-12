const mongoose = require("mongoose");
const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide coupon name"],
      unique: [true, "Coupon already exists"],
      uppercase: true,
    },
    expiry: {
      type: Date,
      required: [true, "Please provide coupon expiry date"],
    },
    discount: {
      type: Number,
      required: [true, "Please provide coupon discount"],
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
