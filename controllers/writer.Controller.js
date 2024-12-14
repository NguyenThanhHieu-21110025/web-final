const Article = require("../models/article.Model");

const writerController = {
    createArticle: async (req, res) => {
        try {
            const newArticle = new Article({
                title: req.body.title,
                summary: req.body.summary,
                content: req.body.content,
                category: req.body.category,
                tags: req.body.tags,
                author: req.user.id,
            });
            const savedArticle = await newArticle.save();
            res.status(201).json(savedArticle);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getArticle: async (req, res) => {
        try {
            const articles = await Article.find({ author: req.user.id });
            res.status(200).json(articles);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    editArticle: async (req, res) => {
        try {
            const article = await Article.findById(req.params.id);
            if (!article) return res.status(404).json("Article not found");
            if (article.status !== 'rejected' && article.status !== 'pending') {
                return res.status(403).json("You can only edit rejected or pending articles");
            }
            const updatedArticle = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true});
            res.status(200).json(updatedArticle);
        } catch (error) {
            res.status(500).json(error);
        }
    },
};

module.exports = writerController;