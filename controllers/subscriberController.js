const path = require('path');
const Article = require('../models/articleModel');

const subscriberController = {
    // Render trang các tùy chọn đăng ký
    getSubscriptionOptions: (req, res) => {
        res.render('subscriber/subscribe', {
            plans: [
                { name: 'Monthly', price: 100000 },
                { name: 'Yearly', price: 1000000 },
            ],
        });
    },

    // Tải bài viết (chỉ dành cho người dùng có đăng ký hợp lệ)
    downloadArticle: async (req, res) => {
        try {
            // Lấy bài viết
            const article = await Article.findById(req.params.id);
            if (!article) {
                return res.status(404).render('errors/404', { message: 'Article not found.' });
            }

            // Tải file
            res.download(path.join(__dirname, '../uploads', article.filePath), (err) => {
                if (err) {
                    return res.status(500).render('errors/500', { message: 'Error downloading file.', error: err.message });
                }
            });
        } catch (err) {
            res.status(500).render('errors/500', { message: 'Internal server error.', error: err.message });
        }
    },
};

module.exports = subscriberController;
