const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

dotenv.config();

const { connectDB } = require("./config/db");
const app = require("./app");

// Port definition
const PORT = process.env.PORT || 5000;

// Create HTTP server and integrate Socket.io
const httpServer = createServer(app);

// Re-use the same CORS options from Express for socket.io
const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    optionsSuccessStatus: 200,
};

const io = new Server(httpServer, {
    cors: corsOptions,
});

// Make io available to request handlers via app
app.set("io", io);

// authentication middleware for sockets
io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
        return next(new Error("Authentication error: token required"));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const User = require("./models/User");
        const user = await User.findById(decoded.id).select("email");
        if (!user) {
            return next(new Error("Authentication error: user not found"));
        }
        socket.user = { id: decoded.id, email: user.email };
        next();
    } catch (err) {
        return next(new Error("Authentication error"));
    }
});

// Handle socket connections
io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id} (user: ${socket.user?.email || "unknown"})`);
    socket.on("disconnect", (reason) => {
        console.log(`Socket disconnected: ${socket.id} (reason: ${reason})`);
    });
});

// Start HTTP server only after the database is connected
connectDB()
    .then(() => {
        httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(`Database connection failed: ${error.message}`);
        process.exit(1);
    });
