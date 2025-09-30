const { User } = require("../models");
const {
  formatSuccessResponse,
  formatErrorResponse,
  getPaginationData,
  getSkipValue
} = require("../utils/helpers");

const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      role = "",
      isActive = ""
    } = req.query;

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    
    if (role) {
      query.role = role;
    }
    
    if (isActive !== "") {
      query.isActive = isActive === "true";
    }

    // Get total count for pagination
    const totalUsers = await User.countDocuments(query);
    
    // Get users with pagination
    const users = await User.find(query)
      .select("-passwordHash")
      .sort({ createdAt: -1 })
      .skip(getSkipValue(page, limit))
      .limit(parseInt(limit));

    const pagination = getPaginationData(page, limit, totalUsers);

    res.json(
      formatSuccessResponse({
        users,
        pagination
      }, "Users retrieved successfully")
    );
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json(
      formatErrorResponse("Failed to retrieve users", 500)
    );
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-passwordHash");
    
    if (!user) {
      return res.status(404).json(
        formatErrorResponse("User not found", 404)
      );
    }

    res.json(
      formatSuccessResponse(user, "User retrieved successfully")
    );
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json(
      formatErrorResponse("Failed to retrieve user", 500)
    );
  }
};





module.exports = {
  getAllUsers,
  getUserById,
};