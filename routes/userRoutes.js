const express = require("express");
const router = express.Router();
const {
    registerUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require("../controllers/userController");

// POST /api/users/register - Register a new user
router.post("/register", registerUser);

// GET /api/users - Get all users
router.get("/", getUsers);

// GET /api/users/:id - Get a user by ID
router.get("/:id", getUserById);

// PUT /api/users/:id - Update a user
router.put("/:id", updateUser);

// DELETE /api/users/:id - Delete a user
router.delete("/:id", deleteUser);

module.exports = router;
