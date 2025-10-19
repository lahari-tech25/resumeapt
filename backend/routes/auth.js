const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/authmiddleware");

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected route
router.get("/dashboard", verifyToken, authController.dashboard);

module.exports = router;
