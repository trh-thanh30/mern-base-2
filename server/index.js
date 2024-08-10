const express = require("express");
const app = express();
const mongoose = require("mongoose");
const coockieParser = require("cookie-parser");
const dotenv = require("dotenv");
const authRouter = require("./routes/user.route.js");
const { notFound, errorHandler } = require("./middlewares/errorHanlder.js");

dotenv.config();
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

app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
