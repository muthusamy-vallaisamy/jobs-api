const { StatusCodes } = require("http-status-codes");
module.exports.RouteNotFound = (req, res, next) => {
  return res
    .status(StatusCodes.NOT_FOUND)
    .json({ status: "failed", message: "The route not found" });
};
