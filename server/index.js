const express = require("express");
const app = express();
const mongoose = require("mongoose");
const coockieParser = require("cookie-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const authRouter = require("./routes/user.route.js");
const productRouter = require("./routes/product.route.js");
const blogRouter = require("./routes/blog.route.js");
const categoryRouter = require("./routes/category.route.js");
const categoryBlogRouter = require("./routes/blog-category.route.js");
const brandRouter = require("./routes/brand.route.js");
const couponRouter = require("./routes/coupon.route.js");
const { notFound, errorHandler } = require("./middlewares/errorHanlder.js");

dotenv.config();
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(coockieParser());

const PORT = process.env.PORT || 4000;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/blog-category", categoryBlogRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);

app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
