const notFound = (req, res, next) => {
    const error = new Error(`Route not found: ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

const errorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV !== "test") {
        console.error(err.stack || err.message);
    }

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Server Error",
    });
};

module.exports = {
    notFound,
    errorHandler,
};
