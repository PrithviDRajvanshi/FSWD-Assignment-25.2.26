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

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
