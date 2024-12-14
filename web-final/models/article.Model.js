const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'rejected', 'pending'],
        default: 'draft',
    },
    author: {
        type: Schema.Types.ObjectID,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        defaultDate: Date.now,
    },
    rejectionReason: {
        type: String,
    },
});

ArticleSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;