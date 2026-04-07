const mongoose = require("mongoose");
const Post = require("../models/Post");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private (requires authentication)
const createPost = async (req, res, next) => {
    try {
        const { title, description, content, tags, coverImage } = req.body;

        // Validate required fields
        if (!title || !description || !content) {
            return next(new ErrorResponse("Please provide title, description, and content", 400));
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
            coverImage: coverImage || null,
        });

        // Populate author details
        await post.populate("author", "name email");

        // emit real-time notification to all connected clients
        const io = req.app.get('io');
        if (io) {
            io.emit('newPost', {
                message: 'A new post has been created',
                post,
            });
        }

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: post,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all posts with pagination
// @route   GET /api/posts
// @access  Public
const getAllPosts = async (req, res, next) => {
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
        next(error);
    }
};

// @desc    Get user's own posts with pagination
// @route   GET /api/posts/user/my-posts
// @access  Private (requires authentication)
const getUserPosts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get user ID from authenticated request
        const userId = req.user.id;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return next(new ErrorResponse("Invalid user ID", 400));
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
        next(error);
    }
};

// @desc    Get a single post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new ErrorResponse("Invalid post ID", 400));
        }

        const post = await Post.findById(id).populate("author", "name email");

        if (!post) {
            return next(new ErrorResponse("Post not found", 404));
        }

        res.status(200).json({
            success: true,
            data: post,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private (requires authentication)
const updatePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, content, tags } = req.body;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new ErrorResponse("Invalid post ID", 400));
        }

        // Find the post
        const post = await Post.findById(id);

        if (!post) {
            return next(new ErrorResponse("Post not found", 404));
        }

        // Check if user is the post author
        if (post.author.toString() !== req.user.id) {
            return next(new ErrorResponse("Not authorized to update this post", 403));
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
        next(error);
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (requires authentication)
const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new ErrorResponse("Invalid post ID", 400));
        }

        // Find the post
        const post = await Post.findById(id);

        if (!post) {
            return next(new ErrorResponse("Post not found", 404));
        }

        // Check if user is the post author
        if (post.author.toString() !== req.user.id) {
            return next(new ErrorResponse("Not authorized to delete this post", 403));
        }

        await Post.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Post deleted successfully",
        });
    } catch (error) {
        next(error);
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
