const express = require("express");
const router = express.Router();
const {
    createPost,
    getAllPosts,
    getUserPosts,
    getPostById,
    updatePost,
    deletePost,
} = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/posts - Create a new post (protected)
router.post("/", protect, createPost);

// GET /api/posts - Get all posts with pagination (public)
router.get("/", getAllPosts);

// GET /api/posts/user/my-posts - Get user's own posts (protected)
router.get("/user/my-posts", protect, getUserPosts);

// GET /api/posts/:id - Get a single post by ID (public)
router.get("/:id", getPostById);

// PUT /api/posts/:id - Update a post (protected)
router.put("/:id", protect, updatePost);

// DELETE /api/posts/:id - Delete a post (protected)
router.delete("/:id", protect, deletePost);

module.exports = router;