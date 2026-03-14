const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Not authorized, token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");

        req.user = { id: decoded.id };

        next();
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, token invalid", error: error.message });
    }
};

const authMiddleware = protect;

module.exports = { protect, authMiddleware };
