const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Register a new user
// @route   POST /api/users/register
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check for missing fields
        if (!name || !email || !password) {
            return next(new ErrorResponse("Please provide all fields", 400));
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new ErrorResponse("User with this email already exists", 400));
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Return user without password
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    } catch (error) {
        // duplicate key error
        if (error.code === 11000) {
            return next(new ErrorResponse("Email already in use", 400));
        }
        next(error);
    }
};

// @desc    Get all users
// @route   GET /api/users
const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

// @desc    Get a user by ID
// @route   GET /api/users/:id
const getUserById = async (req, res, next) => {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(new ErrorResponse("Invalid user ID", 400));
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return next(new ErrorResponse("User not found", 404));
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a user
// @route   PUT /api/users/:id
const updateUser = async (req, res, next) => {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(new ErrorResponse("Invalid user ID", 400));
        }

        const { name, email, password } = req.body;
        const updateFields = {};

        if (name) updateFields.name = name;
        if (email) updateFields.email = email;

        // Re-hash password if it's being updated
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateFields.password = await bcrypt.hash(password, salt);
        }

        const user = await User.findByIdAndUpdate(req.params.id, updateFields, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            return next(new ErrorResponse("User not found", 404));
        }

        res.status(200).json(user);
    } catch (error) {
        if (error.code === 11000) {
            return next(new ErrorResponse("Email already in use", 400));
        }
        next(error);
    }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
const deleteUser = async (req, res, next) => {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return next(new ErrorResponse("Invalid user ID", 400));
        }

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return next(new ErrorResponse("User not found", 404));
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
};

// @desc    Login a user and return JWT
// @route   POST /api/users/login
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorResponse("Please provide email and password", 400));
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return next(new ErrorResponse("Invalid credentials", 401));
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return next(new ErrorResponse("Invalid credentials", 401));
        }

        const payload = { id: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET || "dev_secret", { expiresIn: "1d" });

        res.status(200).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged-in user
// @route   GET /api/users/me
const getMe = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new ErrorResponse("Not authorized", 401));
        }

        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return next(new ErrorResponse("User not found", 404));
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerUser,
    // auth
    loginUser,
    getMe,
    // existing
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
};
