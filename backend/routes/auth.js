const express = require("express");
const { body } = require("express-validator");
const {
  register,
  login,
  logout,
  verifyAuthToken
} = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");
const {
  validateUserRegistration,
  validateUserLogin,
} = require("../utils/validators");

const router = express.Router();

router.post("/register", validateUserRegistration, register);
router.post("/login", validateUserLogin, login);

router.use(authenticate); 
router.post("/logout", logout)
router.get("/verify", verifyAuthToken);

module.exports = router;