const User = require("./../models/user");
const BadRequestError = require("./../error/badrequesterror");
const { StatusCodes } = require("http-status-codes");

exports.signup = async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = newUser.createToken();
  newUser.password = undefined;
  res.status(StatusCodes.CREATED).json({
    status: "success",
    newUser,
    token,
  });
};

exports.login = async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    throw new BadRequestError("Please provide email and password");
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: "failed",
      message: "Invalid email or password",
    });
  }

  const token = user.createToken();
  user.password = undefined;
  res.status(StatusCodes.OK).send({
    status: "success",
    user,
    token,
  });
};
