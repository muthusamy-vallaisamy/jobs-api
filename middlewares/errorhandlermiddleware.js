const { CustomAPIError } = require("./../error");
const { StatusCodes } = require("http-status-codes");

module.exports.globalErrorHandler = (error, req, res, next) => {
  if (error instanceof CustomAPIError) {
    res
      .status(error.statusCode)
      .json({ status: "failed", message: error.message });
  } else {
    if (error.code && error.code === 11000) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "failed",
        message: `Duplicate value for ${Object.keys(
          error.keyValue
        )}. Please provide another value`,
      });
    }

    if (error.name && error.name === "CastError") {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "failed",
        message: `Unable to cast ${error.value}`,
      });
    }
    if (error.name && error.name === "ValidationError") {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "failed",
        message: `${error.message}`,
      });
    }

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "failed", error });
  }
};
