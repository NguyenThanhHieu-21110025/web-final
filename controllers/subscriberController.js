const Article = require('../models/articleModel');
const User = require('../models/user.Model');

const subscriberController = {
    getSubscriptionOptions: (req, res) => {
        res.render('subscriber/subscribe');
    },

    downloadArticle: async (req, res) => {
        try {
            // Kiểm tra xem người dùng đã đăng nhập chưa
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Lấy thông tin người dùng
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Kiểm tra ngày hết hạn
            if (new Date(user.subscription_expiry) <= new Date()) {
                return res.status(403).json({ message: 'Subscription expired' });
            }

            // Lấy bài viết
            const article = await Article.findById(req.params.id);
            if (!article) {
                return res.status(404).json({ message: 'Article not found' });
            }

            // Tải file
            res.download(article.filePath, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error downloading file', error: err.message });
                }
            });
        } catch (err) {
            res.status(500).json({ message: 'Internal server error', error: err.message });
        }
    },
};

module.exports = subscriberController;
