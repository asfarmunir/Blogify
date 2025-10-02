const { User } = require("../models");
const { 
  generateToken, 
  generateRefreshToken, 
  formatSuccessResponse, 
  formatErrorResponse 
} = require("../utils/helpers");

const refreshTokens = new Set();

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json(
        formatErrorResponse("User with this email already exists.", 400)
      );
    }

    const user = new User({
      name,
      email,
      passwordHash: password, 
      role: role || "user"
    });

    await user.save();

    const tokenPayload = { id: user._id, email: user.email, role: user.role };
    const accessToken = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    refreshTokens.add(refreshToken);

    const userResponse = user.toJSON();

    res.status(201).json(
      formatSuccessResponse({
        user: userResponse,
        accessToken,
        refreshToken,
        expiresIn: process.env.JWT_EXPIRE
      }, "User registered successfully", 201)
    );
  } catch (error) {
    console.error("Registration error:", error);
    
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json(
        formatErrorResponse("Validation failed", 400, errors)
      );
    }

    res.status(500).json(
      formatErrorResponse("Server error during registration", 500)
    );
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json(
        formatErrorResponse("Invalid email or password.", 401)
      );
    }

    if (!user.isActive) {
      return res.status(401).json(
        formatErrorResponse("Account is deactivated. Please contact administrator.", 401)
      );
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json(
        formatErrorResponse("Invalid email or password.", 401)
      );
    }

    user.lastLogin = new Date();
    await user.save();

    const tokenPayload = { id: user._id, email: user.email, role: user.role };
    const accessToken = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    refreshTokens.add(refreshToken);

    const userResponse = user.toJSON();

    res.json(
      formatSuccessResponse({
        user: userResponse,
        accessToken,
        refreshToken,
        expiresIn: process.env.JWT_EXPIRE
      }, "Login successful")
    );
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json(
      formatErrorResponse("Server error during login", 500)
    );
  }
};



const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      refreshTokens.delete(refreshToken);
    }

    res.json(
      formatSuccessResponse(null, "Logged out successfully")
    );
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json(
      formatErrorResponse("Server error during logout", 500)
    );
  }
};


const verifyAuthToken = async (req, res) => {
  try {
    res.json(
      formatSuccessResponse({
        valid: true,
        user: req.user
      }, "Token is valid")
    );
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json(
      formatErrorResponse("Server error during token verification", 500)
    );
  }
};

module.exports = {
  register,
  login,
  logout,
  verifyAuthToken
};