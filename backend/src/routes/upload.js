const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/upload");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

const uploadToCloudinary = (fileBuffer) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: "image",
                folder: process.env.CLOUDINARY_FOLDER || "uploads",
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            }
        );

        stream.end(fileBuffer);
    });

router.post("/", authMiddleware, upload.single("image"), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image file is required",
            });
        }

        const result = await uploadToCloudinary(req.file.buffer);

        return res.status(200).json({
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
        });
    } catch (error) {
        next(error);
    }
});

router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                message: "File size must be 5MB or less",
            });
        }

        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    if (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "File upload failed",
        });
    }

    next();
});

module.exports = router;
