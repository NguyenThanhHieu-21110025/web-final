const Article = require("../models/articleModel");
const ApiResponse = require("../utils/ApiReponse");
const User = require("../models/user.Model");

const writerController = {
    viewMyPost: async (req, res) => {
        return res.render("writer/my-article");
    },
    postArticle: async (req, res) => {
        try {
            const {
                title,
                body,
                tags,
                category,
                status = 'pending',
                summary,
                isPremium = false,
                thumbnail = ''
            } = req.body;
            if (!title || !body || !tags || !category || !summary) {
                return res.status(400).json({message: "Title, body, tags, category, and summary are required."});
            }
            if (!Array.isArray(tags)) {
                return res.status(400).json({message: "Tags must be an array of strings."});
            }
            if (['denied', 'published'].includes(status)) {
                return ApiResponse.validationError(res, 'Status only can be [draft , pending]', 400)
            }
            const author = await User.findById(req.user.id);
            if (!author) {
                return ApiResponse.notFound(res, "User not found", 404);
            }

            const article = new Article({
                title,
                content: body,
                tags,
                author: author?._id,
                category,
                summary,
                isPremium,
                thumbnail,
                status: status,
                isPublished: false,
            });

            await article.validate();
            const savedArticle = await article.save();
            return ApiResponse.success(res, savedArticle);
        } catch (err) {
            return ApiResponse.error(res, err.message);
        }
    },
    deleteMyPost: async (req, res) => {
        const {id} = req.params;
        // find article
        const user = await User.findById(req.user.id);
        if (!user) {
            return ApiResponse.notFound(res, "User not found", 404);
        }
        const article = await Article.find({_id: id, author: user?._id});
        if (!article) {
            return ApiResponse.notFound(res, "Article not found", 404);
        }

        // delete article
        await Article.findOneAndDelete({_id: articleId});

        return ApiResponse.success(res);
    },
    updateMyPost: async (req, res) => {
        try {
            const {id} = req.params;
            const {title, content, tags, category, summary, thumbnail} = req.body;

            const user = await User.findById(req.user.id);
            if (!user) {
                return ApiResponse.notFound(res, "User not found", 404);
            }

            const post = await Article.findOne({_id: id, author: req.user.id});
            if (!post) {
                return ApiResponse.notFound(res, "Post not found or you do not have permission to update this post.", 404);
            }

            if (title) post.title = title;
            if (content) post.content = content;
            if (tags) post.tags = tags;
            if (category) post.category = category;
            if (summary) post.summary = summary;
            if (thumbnail) post.thumbnail = thumbnail;

            post.status = 'pending';

            post.updatedAt = Date.now();

            await post.save();

            return ApiResponse.success(res, post);
        } catch (error) {
            console.error(error);
            return ApiResponse.error(res, 500);
        }
    },
    getMyPost: async (req, res) => {
        try {
            // Extract query parameters
            const {status, page = 1, limit = 10, sort = "-createdAt"} = req.query;

            // Validate the user
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
            const query = {
                author: req.user.id,
            };
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
        } catch (error) {
            console.error(error);
            return ApiResponse.error(res, 500);
        }
    }
}
module.exports = writerController