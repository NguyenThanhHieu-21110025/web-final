const mongoose = require("mongoose");
const downloadedArticleModel = new mongoose.Schema({
    articleId: {
        type: mongoose.Types.ObjectId,
        ref: 'Article',
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
const DownloadedArticle = mongoose.model('DownloadedArticle', downloadedArticleModel);
module.exports = DownloadedArticle;