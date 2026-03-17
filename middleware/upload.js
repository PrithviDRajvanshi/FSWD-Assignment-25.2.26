const multer = require("multer");

const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
]);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (!allowedMimeTypes.has(file.mimetype)) {
            const error = new Error("Only jpeg, png, webp, and gif image files are allowed");
            error.statusCode = 400;
            return cb(error);
        }

        cb(null, true);
    },
});

module.exports = upload;
