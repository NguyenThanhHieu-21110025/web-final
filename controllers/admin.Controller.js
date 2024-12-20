const User = require('../models/user.Model');
const Article = require('../models/articleModel');
const Category = require('../models/categoryModel');
const Tag = require('../models/tagModel');

// Quản lý người dùng (Xem danh sách, xem chi tiết)
const adminController = {
    getUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getUserById: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Thêm người dùng
    addUser: async (req, res) => {
        try {
            const newUser = new User(req.body);
            await newUser.save();
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Cập nhật người dùng
    updateUser: async (req, res) => {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedUser) return res.status(404).json({ message: 'User not found' });
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Xoá người dùng
    deleteUser: async (req, res) => {
        try {
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            if (!deletedUser) return res.status(404).json({ message: 'User not found' });
            res.status(200).json({ message: 'User deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Quản lý bài viết (Cập nhật trạng thái bài viết)
    getArticles: async (req, res) => {
        try {
            const articles = await Article.find();
            res.status(200).json(articles);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateArticleStatus: async (req, res) => {
        try {
            const article = await Article.findById(req.params.id);
            if (!article) return res.status(404).json({ message: 'Article not found' });

            article.status = req.body.status; // Trạng thái có thể là 'draft' hoặc 'published'
            await article.save();
            res.status(200).json(article);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Quản lý category
    getCategories: async (req, res) => {
        try {
            const categories = await Category.find();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    addCategory: async (req, res) => {
        try {
            const newCategory = new Category(req.body);
            await newCategory.save();
            res.status(201).json(newCategory);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Quản lý tag
    getTags: async (req, res) => {
        try {
            const tags = await Tag.find();
            res.status(200).json(tags);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    addTag: async (req, res) => {
        try {
            const newTag = new Tag(req.body);
            await newTag.save();
            res.status(201).json(newTag);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Phân công chuyên mục cho biên tập viên
    assignCategoryToEditor: async (req, res) => {
        try {
            const editor = await User.findById(req.params.editorId);
            if (!editor || editor.role !== 'editor') return res.status(404).json({ message: 'Editor not found' });

            editor.categories = req.body.categories; // Chỉ định các chuyên mục cho biên tập viên
            await editor.save();
            res.status(200).json(editor);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Gia hạn tài khoản độc giả
    extendSubscription: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user || user.role !== 'subscriber') return res.status(404).json({ message: 'Subscriber not found' });

            user.subscription_expiry = req.body.subscription_expiry;
            await user.save();
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = adminController;