const express = require("express");
const {
  getAllUsers,
  getUserById,
} = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate);

router.get("/",  getAllUsers);


router.get("/:id", 
  getUserById
);



module.exports = router;