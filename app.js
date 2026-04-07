const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables for both runtime and tests
dotenv.config();

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const uploadRoutes = require("./routes/upload");

// Initialize Express
const app = express();

// Configure CORS with CLIENT_URL from environment variables
const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/upload", uploadRoutes);

// Test connection endpoint
app.get("/api/connection-test", (req, res) => {
    res.json({
        success: true,
        message: "Frontend-Backend connection is working!",
        timestamp: new Date().toISOString(),
        clientUrl: process.env.CLIENT_URL,
    });
});

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Creator's Platform API" });
});

app.get("/api/test-error", (req, res, next) => {
    const err = new Error("Intentional test error");
    err.statusCode = 400;
    next(err);
});

// global error handler
app.use((err, req, res, next) => {
    if (process.env.NODE_ENV !== "test") {
        console.error(err.stack);
    }
    const statusCode = err.statusCode || 500;
    const message = err.message || "Server Error";
    res.status(statusCode).json({ success: false, message });
});

module.exports = app;
