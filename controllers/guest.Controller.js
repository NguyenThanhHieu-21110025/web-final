const Category = require("../models/categoryModel");
const Article = require('../models/articleModel');
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
            res.render('guest/article', {article});
        } catch (err) {
            res.status(500).json(err);
        }
    },

};

module.exports = guestController;
