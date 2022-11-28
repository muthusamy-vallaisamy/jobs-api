const mongoose = require("mongoose");
const customValidator = require("validator");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide name"],
    minLength: 7,
    maxLength: 12,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    validate: {
      validator: customValidator.isEmail,
      message: "Invalid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minLength: 7,
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bycrypt.genSalt(10);
  const hasedPassword = await bycrypt.hash(this.password, salt);
  this.password = hasedPassword;
  next();
});

userSchema.methods.createToken = function () {
  return jwt.sign(
    { userId: this._id, username: this.username },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

userSchema.methods.comparePassword = async function (givenPassword) {
  return await bycrypt.compare(givenPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
