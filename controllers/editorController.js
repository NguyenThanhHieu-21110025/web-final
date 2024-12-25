const ApiResponse = require("../utils/ApiReponse");
const User = require("../models/user.Model");
const Article = require("../models/articleModel");
const {ar, fa, ne} = require("@faker-js/faker");
const Category = require("../models/categoryModel");
const editorController = {
    getAllWriterArticle: async (req, res) => {
        try {
            const {status, page = 1, limit = 10, sort = "-updatedAt"} = req.query;
            const user = await User.findById(req.user.id);
            if (!user) {
                return ApiResponse.notFound(res, "User not found", 404);
            }

            // Validate status
            const validStatuses = ["pending", "denied", "published"];
            if (status && !validStatuses.includes(status)) {
                return ApiResponse.validationError(res, "Invalid status. Allowed values: pending, denied, published.");
            }
            // Build the query
            const query = {};
            // Add status filter if provided
            if (status) {
                if (status === "published") {
                    query.isPublished = true;
                } else {
                    query.isPublished = false;
                    query.status = status;
                }
            }

            const pageNumber = parseInt(page, 10);
            const pageSize = parseInt(limit, 10);
            if (pageNumber < 1 || pageSize < 1) {
                return ApiResponse.validationError(res, "Page and limit must be greater than 0");
            }
            const posts = await Article.find(query)
                .sort(sort) // Apply sorting
                .skip((pageNumber - 1) * pageSize) // Apply pagination
                .limit(pageSize);

            const totalPosts = await Article.countDocuments(query);

            return ApiResponse.success(res, {
                posts,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalPosts / pageSize),
                totalPosts,
            });
        } catch (err) {
            console.log(err)
            return ApiResponse.error(res, 500);
        }
    },
    verifyArticle: async (req, res) => {
        try {
            const {id} = req.params;
            const user = await User.findById(req.session.user.userId);
            if (!user) {
                return ApiResponse.notFound(res, "User not found", 404);
            }
            const article = await Article.findById(id);
            if (!article) {
                return ApiResponse.notFound(res, "Article not found", 404);
            }
            article.publishedAt = Date.now();
            article.status = "published";
            article.isPublished = true;
            article.updatedAt = Date.now();
            await article.save();
            return res.redirect('http://localhost:8080/editor/profile');
        } catch (err) {
            console.log(err)
            return ApiResponse.error(res, 500);
        }
    },
    deniedArticle: async (req, res) => {
        try {
            const {id} = req.params;
            const {note} = req.body;
            const user = await User.findById(req.session.user.userId);
            if (!user) {
                return ApiResponse.notFound(res, "User not found", 404);
            }
            const article = await Article.findById(id);
            if (!article) {
                return ApiResponse.notFound(res, "Article not found", 404);
            }

            article.status = "denied";
            if (note) {
                article.note = note;
            }
            article.updatedAt = Date.now();
            await article.save();
            return ApiResponse.success(res);
        } catch (err) {
            console.log(err)
            return ApiResponse.error(res, 500);
        }
    },
    editArticle: async (req, res) => {
        try {
            const {id} = req.params;
            const {tags, category, publishedAt, content, title, summary, thumbnail} = req.body;

            const user = await User.findById(req.session.user.userId);

            if (!user) {
                return ApiResponse.notFound(res, "User not found", 404);
            }

            const post = await Article.findById(id);
            if (!post) {
                return ApiResponse.notFound(res, "Post not found or you do not have permission to update this post.", 404);
            }

            if (tags && Array.isArray(tags)) {
                post.tags = tags;
            }
            if (category) post.category = category;
            if (publishedAt) post.publishedAt = publishedAt;
            if (content && content.length > 1000) post.content = content;
            if (title && title.length > 20) post.title = title;
            if (summary && summary.length > 10) post.summary = summary;
            if (thumbnail) post.thumbnail = thumbnail;
            post.status = 'pending';

            post.updatedAt = Date.now();

            await post.save();

            return ApiResponse.success(res, post);
        } catch (err) {
            console.log(err)
            return ApiResponse.error(res, 500);
        }
    },
    getArticle: async (req, res) => {
        const id = req.params.id;
        if (!id) {
            return ApiResponse.notFound(res);
        }
        console.log(id)
        const article = await Article.findById(id);
        return res.status(200).json(article);
    },
    allWriterArticleView: async (req, res) => {
        const allChildCate = await Category.find({parentId: {$ne: null}});
        const tabs = ['pendingArticles', 'approvedArticles', 'rejectedArticles'];
        const page = req.query.page || 1;
        const tab = req.query.tab || tabs[0];
        const limit = 6;
        let articles = [];
        let totalCount = 0;
        const skip = (page - 1) * limit;
        let canEdit = false;
        let canPublish = false;
        let canDenied = false;
        let viewInfo = false;
        switch (tab) {
            case 'pendingArticles':
                canEdit = true;
                canPublish = true;
                canDenied = true;
                viewInfo = false;

                articles = await Article.find({status: 'pending'})
                    .sort({createdAt: -1}).skip(skip).limit(limit)
                    .populate({path: 'author', model: 'User'});
                totalCount = await Article.find({status: 'pending'}).countDocuments();
                break;
            case 'approvedArticles':
                canEdit = false;
                canPublish = false;
                canDenied = false;
                viewInfo = true;
                articles = await Article.find({status: 'published'})
                    .sort({publishedAt: -1}).skip(skip).limit(limit)
                    .populate({path: 'author', model: 'User'});
                totalCount = await Article.find({status: 'published'}).countDocuments();
                break;
            case 'rejectedArticles':
                canEdit = true;
                canPublish = false;
                canDenied = false;
                viewInfo = false;
                articles = await Article.find({status: 'denied'})
                    .sort({updatedAt: -1}).skip(skip).limit(limit)
                    .populate({path: 'author', model: 'User'});
                totalCount = await Article.find({status: 'denied'}).countDocuments();
                break;
        }
        const pages = Math.ceil(totalCount / limit) > 0 ? new Array(Math.ceil(totalCount / limit)).map((_, i) => i + 1) : [];
        return res.render("editor/writer-article", {
            user: req.session.user,
            articles,
            actions: {
                canDenied, canEdit, canPublish, viewInfo
            },
            allChildCate,
            paginate: {
                pages, page, totalCount
            }
        })
    }
}

module.exports = editorController;