const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getMe,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/users/register - Register a new user
router.post("/register", registerUser);

// POST /api/users/login - Login a user and return JWT
router.post("/login", loginUser);

// GET /api/users/me - Get current logged-in user
router.get("/me", protect, getMe);

// GET /api/users - Get all users
router.get("/", getUsers);

// GET /api/users/:id - Get a user by ID
router.get("/:id", getUserById);

// PUT /api/users/:id - Update a user
router.put("/:id", updateUser);

// DELETE /api/users/:id - Delete a user
router.delete("/:id", deleteUser);

module.exports = router;
