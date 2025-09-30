const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { formatErrorResponse } = require("../utils/helpers");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json(
        formatErrorResponse("Access denied. No token provided.", 401)
      );
    }
    const token = authHeader.substring(7); 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user || !user.isActive) {
      return res.status(401).json(
        formatErrorResponse("Invalid token or user not found.", 401)
      );
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json(
        formatErrorResponse("Invalid token.", 401)
      );
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json(
        formatErrorResponse("Token expired.", 401)
      );
    }
    
    console.error("Authentication error:", error);
    return res.status(500).json(
      formatErrorResponse("Server error during authentication.", 500)
    );
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(
        formatErrorResponse("Authentication required.", 401)
      );
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json(
        formatErrorResponse("Access denied. Insufficient permissions.", 403)
      );
    }

    next();
  };
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-passwordHash");
    
    if (user && user.isActive) {
      req.user = user;
    }
    
    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth
};