const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide a title"],
            minlength: [3, "Title must be at least 3 characters"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Please provide a description"],
            minlength: [10, "Description must be at least 10 characters"],
        },
        content: {
            type: String,
            required: [true, "Please provide content"],
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Post must have an author"],
        },
        likes: {
            type: Number,
            default: 0,
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        coverImage: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
