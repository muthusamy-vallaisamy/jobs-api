const CustomAPIError = require("./customapierror");
const { StatusCodes } = require("http-status-codes");

module.exports = class UnAuthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message, StatusCodes.UNAUTHORIZED);
  }
};
