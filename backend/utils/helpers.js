const jwt = require("jsonwebtoken");

const generateToken = (payload, secret = process.env.JWT_SECRET, expiresIn = process.env.JWT_EXPIRE) => {
  return jwt.sign(payload, secret, { expiresIn });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { 
    expiresIn: process.env.JWT_REFRESH_EXPIRE 
  });
};

const formatErrorResponse = (message, statusCode = 500, errors = null) => {
  return {
    success: false,
    message,
    statusCode,
    errors,
    timestamp: new Date().toISOString()
  };
};

const formatSuccessResponse = (data, message = "Success", statusCode = 200) => {
  return {
    success: true,
    message,
    statusCode,
    data,
    timestamp: new Date().toISOString()
  };
};



module.exports = {
  generateToken,
  generateRefreshToken,
  formatErrorResponse,
  formatSuccessResponse,
};