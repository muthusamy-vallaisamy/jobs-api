const jwt = require("jsonwebtoken");
const User = require("./../models/user");

const UnAuthenticatedError = require("./../error/unauthenticatederror");
const authenticate = async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    throw new UnAuthenticatedError("Please login before making the request.");
  }

  const token = req.headers.authorization.replace("Bearer ", "");

  const tokenObject = jwt.verify(token, process.env.JWT_SECRET);
  const { userId, username, iat } = tokenObject;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new UnAuthenticatedError("Please login before making the request.");
  }
  user.password = undefined;
  req.user = user;

  next();
};

module.exports = authenticate;
