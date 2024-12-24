const Category = require("../models/categoryModel");
const Article = require('../models/articleModel');
const mongoose = require('mongoose');
const Comment = require('../models/commentModel');
const ApiResponse = require("../utils/ApiReponse.js")
const getLocalUri = require("../utils/UriHelper");
const getAllCategory = require("../utils/LayoutHelper");
const {ne} = require("@faker-js/faker");
const APP_URI = getLocalUri("guest");
const guestController = {
    home: async (req, res) => {
        try {
            // dont forget it
            const allCategory = await getAllCategory();
            const topArticles = await Article.find({status: 'published'}).sort({views: -1}).limit(3);
            const mostViewedArticles = await Article.find({status: 'published'}).sort({views: -1}).limit(10);
            const latestArticles = await Article.find({status: 'published'}).sort({createdAt: -1}).limit(10);
            // get top category
            // NOTE : need category data first
            res.render('guest/home', {
                title: 'Home',
                topArticles,
                mostViewedArticles,
                latestArticles,
                uri: APP_URI,
                allCategory
            });
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
            let page = req.query.page || 1;
            let limit = req.query.limit || 10;
            limit = Math.min(limit, 30);

            const allCategory = await getAllCategory();
            const allChildCat = await Category.find({parentId: {$ne: null}});
            let title = '';
            if (!mongoose.isValidObjectId(categoryId)) {
                const category = await Category.findById(categoryId);
                if (!category) {
                    return res.status(404).json({message: 'Category not found'});
                }
                categoryId = category._id;
                title = category.category_name;
            }
            // get total count
            const total = await Article.find({category: categoryId}).countDocuments()
            const pages = Math.ceil(total / limit);
            const paginate = {
                page, total, pages: new Array(pages - 1).fill(0).map((_, i) => i + 1)
            }
            const articles = await Article.find({category: categoryId}).skip((page - 1) * limit).limit(limit);
            const newArticle = await Article.find({category: categoryId}).sort({createdAt: -1}).limit(10);
            const mostViewArticle = await Article.find({category: categoryId}).sort({views: -1}).limit(limit);
            res.render('guest/category', {
                title,
                articles,
                allCategory,
                allChildCat,
                uri: APP_URI,
                newArticle,
                mostViewArticle,
                paginate
            });
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
            console.log(article)
            const comments = await Comment.find({article_id: article._id}).sort({created_at: -1});
            const relationArticles = await Article.find({category: article.category}).sort({createdAt: -1}).limit(10);

            res.render('guest/article', {article, comments, relationArticles});
        } catch (err) {
            res.status(500).json(err);
        }
    },
};

module.exports = guestController;
