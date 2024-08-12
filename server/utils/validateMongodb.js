const mongoose = require("mongoose");
const validateMongodbId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) {
     throw new Error("Not a valid mongoDB id or not found id");
  }
};

module.exports = validateMongodbId;
