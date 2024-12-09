const Article = require('../models/articleModel');

const guestController = {
    home: async (req, res) => {
        try {
            const topArticles = await Article.find().sort({ views: -1 }).limit(3);
            const mostViewedArticles = await Article.find().sort({ views: -1 }).limit(10);
            const latestArticles = await Article.find().sort({ createdAt: -1 }).limit(10);
            res.render('guest/home', { topArticles, mostViewedArticles, latestArticles });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getCategoryArticles: async (req, res) => {
        try {
            let categoryId = req.params.id;
    
            if (!mongoose.isValidObjectId(categoryId)) {
                // Nếu không phải ObjectId, tìm bằng slug
                const category = await Category.findOne({ slug: req.params.slug });
                if (!category) {
                    return res.status(404).json({ message: 'Category not found' });
                }
                categoryId = category._id;
            }
    
            const articles = await Article.find({ category: categoryId }).limit(10);
            res.render('guest/category', { articles });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getTagArticles: async (req, res) => {
        try {
            const articles = await Article.find({ tags: req.params.id }).limit(10);
            res.render('guest/tag', { articles });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getArticleDetail: async (req, res) => {
        try {
            const article = await Article.findById(req.params.id);
            res.render('guest/article', { article });
        } catch (err) {
            res.status(500).json(err);
        }
    },
};

module.exports = guestController;
