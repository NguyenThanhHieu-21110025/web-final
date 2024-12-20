const ApiResponse = require("../utils/ApiReponse");
const User = require("../models/user.Model");
const Article = require("../models/articleModel");
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
            const user = await User.findById(req.user.id);
            if (!user) {
                return ApiResponse.notFound(res, "User not found", 404);
            }
            const article = await Article.find({_id: id});
            if (!article) {
                return ApiResponse.notFound(res, "Article not found", 404);
            }
            article.publishedAt = Date.now();
            article.status = "published";
            article.isPublished = true;
            article.updatedAt = Date.now();
            await article.save();

            return ApiResponse.success(res);
        } catch (err) {
            console.log(err)
            return ApiResponse.error(res, 500);
        }
    },
    deniedArticle: async (req, res) => {
        try {
            const {id} = req.params;
            const {note} = req.body;
            const user = await User.findById(req.user.id);
            if (!user) {
                return ApiResponse.notFound(res, "User not found", 404);
            }
            const article = await Article.find({_id: id});
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
            const {tags, category, publishedAt} = req.body;

            const user = await User.findById(req.user.id);

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

            post.status = 'pending';

            post.updatedAt = Date.now();

            await post.save();

            return ApiResponse.success(res, post);
        } catch (err) {
            console.log(err)
            return ApiResponse.error(res, 500);
        }
    },
    allWriterArticleView: async (req, res) => {
        return res.render("editor/writer-article")
    }
}

module.exports = editorController;