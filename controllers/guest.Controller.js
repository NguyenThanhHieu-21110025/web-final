const Category = require("../models/categoryModel");
const Article = require('../models/articleModel');
const Comment = require('../models/commentModel.js');
const mongoose = require('mongoose');

const ApiResponse = require("../utils/ApiReponse.js")

const guestController = {
    home: async (req, res) => {
        try {
            const topArticles = await Article.find().sort({views: -1}).limit(3);
            const mostViewedArticles = await Article.find().sort({views: -1}).limit(10);
            const latestArticles = await Article.find().sort({createdAt: -1}).limit(10);
            res.render('guest/home', {topArticles, mostViewedArticles, latestArticles});
        } catch (err) {
            res.status(500).json({err});
        }
    },
    searchArticle: async (req, res) => {
        try {
            // NOTE : this method can implement sort by any field of article,
            // If u want sort by isPremium field pls pass it to query param

            const {sortBy = 'createdAt', sortType = 'desc', page = 1, limit = 10, query = ''} = req.query;
            const validSortType = ['desc', 'asc', 1, -1].includes(sortType);
            if (!validSortType) {
                ApiResponse.validationError(res, {sortType: 'SortType Not Implement [desc,asc,1,-1]'}, 400)
                return;
            }
            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);
            const skip = (pageNumber - 1) * limitNumber;
            const searchQuery = query ? {$text: {$search: query}, isPublished: true} : {};

            const articles = await Article.find(searchQuery)
                .skip(skip)
                .limit(limitNumber)
                .sort({[sortBy]: sortType})

            const totalCount = await Article.countDocuments(searchQuery);
            return ApiResponse.success(res, "", {
                articles,
                pagination: {page, totalPages: Math.ceil(totalCount / limitNumber), totalCount}
            })
        } catch (err) {
            return ApiResponse.error(res, 500);
        }
    },
    getCategoryArticles: async (req, res) => {
        try {
            let categoryId = req.params.id;

            if (!mongoose.isValidObjectId(categoryId)) {
                const category = await Category.findOne({slug: req.params.slug});
                if (!category) {
                    return res.status(404).json({message: 'Category not found'});
                }
                categoryId = category._id;
            }

            const articles = await Article.find({category: categoryId}).limit(10);
            res.render('guest/category', {articles});
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getTagArticles: async (req, res) => {
        try {
            const articles = await Article.find({tags: req.params.id}).limit(10);
            res.render('guest/tag', {articles});
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getArticleDetail: async (req, res) => {
        try {
            const article = await Article.findById(req.params.id);
    
            if (!article) {
                return res.status(404).render('404', { message: 'Bài viết không tồn tại' });
            }
    
            // Định dạng ngày trong controller
            const formattedArticle = {
                ...article.toObject(),
                createdAtFormatted: article.createdAt.toLocaleDateString('en-GB'), // Định dạng ngày theo định dạng mong muốn
            };
    
            const comments = await Comment.find({ article_id: article._id }).sort({ createdAt: -1 });
    
            res.render('guest/articleDetail', {
                article: formattedArticle,
                comments,
            });
        } catch (err) {
            console.error(err);
            res.status(500).render('500', { message: 'Đã xảy ra lỗi server' });
        }
    },
    
};

module.exports = guestController;
