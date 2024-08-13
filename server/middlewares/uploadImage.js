const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});

const productImgResize = async (req, res, next) => {
  if (!req.files) return next();

  const productImagePath = path.join(__dirname, "../public/images/products");

  // Ensure the directory exists, create it if it doesn't
  if (!fs.existsSync(productImagePath)) {
    fs.mkdirSync(productImagePath, { recursive: true });
  }

  await Promise.all(
    req.files.map(async (file) => {
      const outputFilePath = path.join(productImagePath, file.filename);

      try {
        await sharp(file.path)
          .resize(300, 300)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(outputFilePath);
      } catch (err) {
        console.error(`Failed to process image: ${file.filename}`, err);
        return next(err); // Pass the error to the next middleware
      }
    })
  );

  next();
};

const blogImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/blogs/${file.filename}`);
    })
  );
  next();
};

module.exports = { uploadPhoto, productImgResize, blogImgResize };
