const mongoose = require("mongoose");
const Post = require("../models/Post");

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private (requires authentication)
const createPost = async (req, res) => {
    try {
        const { title, description, content, tags } = req.body;

        // Validate required fields
        if (!title || !description || !content) {
            return res
                .status(400)
                .json({ message: "Please provide title, description, and content" });
        }

        // Get user ID from authenticated request
        const userId = req.user.id;

        // Create new post
        const post = await Post.create({
            title,
            description,
            content,
            author: userId,
            tags: tags || [],
        });

        // Populate author details
        await post.populate("author", "name email");

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: post,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// @desc    Get all posts with pagination
// @route   GET /api/posts
// @access  Public
const getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get total count for pagination metadata
        const total = await Post.countDocuments();

        // Fetch posts with pagination and populate author info
        const posts = await Post.find()
            .populate("author", "name email")
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip(skip)
            .limit(limit);

        // Calculate pagination metadata
        const pages = Math.ceil(total / limit);
        const hasNextPage = page < pages;
        const hasPrevPage = page > 1;

        res.status(200).json({
            success: true,
            data: posts,
            pagination: {
                currentPage: page,
                totalPages: pages,
                totalPosts: total,
                postsPerPage: limit,
                hasNextPage,
                hasPrevPage,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// @desc    Get user's own posts with pagination
// @route   GET /api/posts/user/my-posts
// @access  Private (requires authentication)
const getUserPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get user ID from authenticated request
        const userId = req.user.id;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // Get total count for this user's posts
        const total = await Post.countDocuments({ author: userId });

        // Fetch user's posts with pagination
        const posts = await Post.find({ author: userId })
            .populate("author", "name email")
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip(skip)
            .limit(limit);

        // Calculate pagination metadata
        const pages = Math.ceil(total / limit);
        const hasNextPage = page < pages;
        const hasPrevPage = page > 1;

        res.status(200).json({
            success: true,
            data: posts,
            pagination: {
                currentPage: page,
                totalPages: pages,
                totalPosts: total,
                postsPerPage: limit,
                hasNextPage,
                hasPrevPage,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// @desc    Get a single post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid post ID" });
        }

        const post = await Post.findById(id).populate("author", "name email");

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({
            success: true,
            data: post,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private (requires authentication)
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, content, tags } = req.body;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid post ID" });
        }

        // Find the post
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if user is the post author
        if (post.author.toString() !== req.user.id) {
            return res
                .status(403)
                .json({ message: "Not authorized to update this post" });
        }

        // Update fields
        if (title) post.title = title;
        if (description) post.description = description;
        if (content) post.content = content;
        if (tags) post.tags = tags;

        await post.save();
        await post.populate("author", "name email");

        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: post,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (requires authentication)
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid post ID" });
        }

        // Find the post
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if user is the post author
        if (post.author.toString() !== req.user.id) {
            return res
                .status(403)
                .json({ message: "Not authorized to delete this post" });
        }

        await Post.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Post deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getUserPosts,
    getPostById,
    updatePost,
    deletePost,
};
