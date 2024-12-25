const Category = require("../models/categoryModel");
const Article = require('../models/articleModel');
const mongoose = require('mongoose');
const Comment = require('../models/commentModel');
const ApiResponse = require("../utils/ApiReponse.js")
const getLocalUri = require("../utils/UriHelper");
const getAllCategory = require("../utils/LayoutHelper");
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
            const {sortBy = 'createdAt', sortType = 'desc', page = 1, limit = 10, query = ''} = req.query;
            const validSortType = ['desc', 'asc', 1, -1].includes(sortType);
            if (!validSortType) {
                ApiResponse.validationError(res, {sortType: 'SortType Not Implement [desc,asc,1,-1]'}, 400)
                return;
            }
            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);
            const skip = (pageNumber - 1) * limitNumber;
            const searchQuery = query
                ? {$and: [{$text: {$search: query}}, {isPublished: true}]}
                : {isPublished: true};
            const articles = await Article.find(searchQuery)
                .skip(skip)
                .limit(limitNumber)
                .sort({[sortBy]: sortType})
            const totalCount = await Article.countDocuments(searchQuery);
            const pages = Math.ceil(totalCount / limitNumber);
            const pagination = {
                page,
                pages: page > 1 ? new Array(pages - 1).fill(0).map((_, i) => i + 1) : [],
                totalCount
            }
            const mostViewedArticles = await Article.find({status: 'published'}).sort({views: -1}).limit(10);
            return res.render("guest/article_search", {articles, paginate: pagination, mostViewedArticles});
        } catch (err) {
            console.log(err)
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
            const articles = await Article.find({
                category: categoryId,
                status: 'published'
            }).skip((page - 1) * limit).limit(limit);
            const newArticle = await Article.find({
                category: categoryId,
                status: 'published'
            }).sort({createdAt: -1}).limit(10);
            const mostViewArticle = await Article.find({
                category: categoryId,
                status: 'published'
            }).sort({views: -1}).limit(limit);
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
            const limit = 12;
            const page = req.query.page || 1;
            const articles = await Article.find({tags: {$in: req.params.name}}).skip((page - 1) * limit).limit(limit);
            // return pager
            const total = await Article.find({tags: {$in: req.params.name}}).countDocuments();
            const pages = Math.ceil(total / limit);
            const totalPage = pages > 0 ? new Array(pages - 1).fill(0).map((_, i) => i + 1) : []
            const newArticle = await Article.find({tags: {$in: req.params.name}}).sort({createdAt: -1}).limit(limit);
            const allCategory = await getAllCategory();
            res.render('guest/tag', {
                allCategory,
                articles,
                uri: APP_URI,
                paginate: {page, pages: totalPage}, newArticle
            });
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
