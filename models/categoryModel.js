const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Đảm bảo không có 2 danh mục trùng tên
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true, // Slug duy nhất để SEO và dễ dàng truy cập
        trim: true,
    },
    description: {
        type: String,
        trim: true, // Mô tả ngắn về danh mục
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Danh mục cha (nếu có)
        default: null, // null nếu không có danh mục cha
    },
    createdAt: {
        type: Date,
        default: Date.now, // Ngày tạo danh mục
    },
    updatedAt: {
        type: Date,
    },
});
const slugify = require('slugify');

categorySchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;

///vis duj
// {
//     "_id": "648b1bf3a5b536a1e8924f82",
//     "name": "Technology",
//     "slug": "technology",
//     "description": "Articles about the latest in technology and innovation.",
//     "parentCategory": null,
//     "createdAt": "2024-12-08T10:00:00.000Z",
//     "updatedAt": "2024-12-08T15:30:00.000Z"
// }