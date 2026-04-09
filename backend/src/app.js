const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables for both runtime and tests
dotenv.config();

const corsOptions = require("./config/cors");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const uploadRoutes = require("./routes/upload");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Initialize Express
const app = express();

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

app.use(notFound);
app.use(errorHandler);

module.exports = app;
