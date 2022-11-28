const CustomAPIError = require("./customapierror");
const { StatusCodes } = require("http-status-codes");

module.exports = class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message, StatusCodes.BAD_REQUEST);
  }
};
