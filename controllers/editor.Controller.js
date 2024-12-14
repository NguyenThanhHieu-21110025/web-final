const Article = require("../models/article.Model");

const editorController = {
    getDraftArticles: async (req, res) => {
        try {
            const articles = await Article.find({status:'draft', category: req.user.category});
            res.status(200).json(articles);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    approveArticle: async (req, res) => {
        try {
            const article = await Article.findById(req.params.id);
            if (!article) return res.status(404).json("Article not found");
            article.status = 'published';
            await article.save();
            res.status(200).json(article);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    rejectArticle: async (req, res) => {
        try {
            const article = await Article.findById(req.params.id);
            if (!article) return res.status(404).json("Article not found");
            article.status = 'rejected';
            article.rejectionReason = req.body.reason;
            await article.save();
            res.status(200).json(article);
        } catch (error) {
            res.status(500).json(error);
        }
    },
};

module.exports = editorController;