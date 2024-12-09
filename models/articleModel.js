const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Nếu bạn có một collection riêng cho category
        required: true,
    },
    tags: [
        {
            type: String, // Danh sách từ khóa liên quan
            trim: true,
        },
    ],
    views: {
        type: Number,
        default: 0,
    },
    //tóm tắt văn bản
    summary: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
    isPublished: {
        type: Boolean,
        default: false, // Cờ kiểm tra bài viết đã được xuất bản hay chưa
    },
    thumbnail: {
        type: String, // URL hoặc đường dẫn đến hình ảnh đại diện
        trim: true,
    },
});

const Article = mongoose.model('Article', articleSchema);

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