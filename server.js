const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express
const app = express();

// Port definition
const PORT = process.env.PORT || 5000;

// Middleware
// Configure CORS with CLIENT_URL from environment variables
const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Test connection endpoint
app.get("/api/connection-test", (req, res) => {
    res.json({
        success: true,
        message: "Frontend-Backend connection is working!",
        timestamp: new Date().toISOString(),
        serverPort: PORT,
        clientUrl: process.env.CLIENT_URL
    });
});

// Root route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Creator's Platform API" });
});

// Route used to intentionally trigger an error for demonstration
app.get("/api/test-error", (req, res, next) => {
    const err = new Error("Intentional test error");
    err.statusCode = 400;
    next(err);
});

// global error handler (must come after all routes)
app.use((err, req, res, next) => {
    // log for debugging, but don't expose stack to client
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Server Error";
    res.status(statusCode).json({ success: false, message });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
