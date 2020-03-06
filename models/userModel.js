const mongoose = require("mongoose");

const { Schema } = mongoose;

const userModel = new Schema({
  username: { type: String },
  profile: { type: String },
  phoneNumber: { type: String },
  address: { type: String },
  nickname: { type: String },
  dateOfBirth: { type: Date },
  book: { type: String },
  spouse: { type: String },
  password: { type: String }
});

module.exports = mongoose.model("User", userModel);
