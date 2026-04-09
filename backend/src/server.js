const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

dotenv.config();

const { connectDB } = require("./config/db");
const corsOptions = require("./config/cors");
const app = require("./app");
const User = require("./models/User");

const port = process.env.PORT || 5000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: corsOptions,
});

app.set("io", io);

io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
        return next(new Error("Authentication error: token required"));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
        const user = await User.findById(decoded.id).select("email");

        if (!user) {
            return next(new Error("Authentication error: user not found"));
        }

        socket.user = { id: decoded.id, email: user.email };
        return next();
    } catch (error) {
        return next(new Error("Authentication error"));
    }
});

io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id} (user: ${socket.user?.email || "unknown"})`);

    socket.on("disconnect", (reason) => {
        console.log(`Socket disconnected: ${socket.id} (reason: ${reason})`);
    });
});

const startServer = async () => {
    try {
        await connectDB();

        httpServer.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error(`Failed to start backend: ${error.message}`);
        process.exit(1);
    }
};

process.on("unhandledRejection", (error) => {
    console.error(`Unhandled rejection: ${error.message}`);
});

startServer();
