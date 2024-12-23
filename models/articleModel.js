const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 20, // min title length is 20
        maxlength: 150, //m ax title length is 150
    },
    content: {
        type: String,
        required: true,
        minlength: 200,
        maxLength: 30000,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    tags: [
        {
            type: String,
            trim: true,
            maxlength: 30,
        },
    ],
    views: {
        type: Number,
        default: 0,
        min: 0,
    },
    summary: {
        type: String,
        trim: true,
        maxlength: 300,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    publishBy: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    publishedAt: {
        type: Date,
        required: false,
    },
    status: {
        type: String,
        enum: ["draft", "pending", "published", "denied"],
        default: "draft",
        required: true,
    },
    thumbnail: {
        type: String,
        trim: true,
        maxlength: 255,
    },
    isPremium: {
        type: Boolean,
        default: false,
        required: true,
    },
    note: {
        type: String,
        required: false,
    },
});

articleSchema.index({title: "text", content: "text", tags: "text"});
const Article = mongoose.model("Article", articleSchema);

module.exports = Article;

// ví dụ
// {
//     "_id": "648b27fef8b547b1d8924f93",
//     "title": "How to Learn Node.js",
//     "content": "Node.js is a powerful runtime for building server-side applications...",
//     "author": "John Doe",
//     "category": "648b1bf3a5b536a1e8924f82",
//     "tags": ["Node.js", "Backend", "JavaScript"],
//     "views": 150,
//     "createdAt": "2024-12-08T10:00:00.000Z",
//     "updatedAt": "2024-12-08T15:30:00.000Z",
//     "isPublished": true,
//     "thumbnail": "https://example.com/images/nodejs-guide.jpg"
// }
