const User = require('../models/user.Model');
const Article = require('../models/articleModel');
const Category = require('../models/categoryModel');
const Tag = require('../models/tagModel');

const adminController = {
    getUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.render('userList', { title: 'Danh sách người dùng', users: users });
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

    addUser: async (req, res) => {
        try {
            const newUser = new User(req.body);
            await newUser.save();
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateUser: async (req, res) => {
        try {
            const { username, email, full_name, pen_name, role } = req.body;
            const userId = req.params.id;
    
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: 'User not found' });
    
            user.username = username;
            user.email = email;
            user.full_name = full_name;
            user.pen_name = pen_name;
            user.role = role;
    
            await user.save();
            res.redirect('/admin/users');
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    
    
    deleteUser: async (req, res) => {
        try {
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            if (!deletedUser) return res.status(404).json({ message: 'User not found' });
            res.redirect('/admin/dashboard');
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    

    renderUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.render('admin/users', { title: 'Quản lý người dùng', users });
        } catch (error) {
            res.status(500).send('Lỗi khi tải trang người dùng.');
        }
    },

    getArticles: async (req, res) => {
        try {
            const articles = await Article.find()
                .populate('category', 'category_name') 
                .populate('author', 'username') 
                .lean(); 

            res.status(200).json(articles);  
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateArticleStatus: async (req, res) => {
        try {
            const article = await Article.findById(req.params.id);
            if (!article) return res.status(404).json({ message: 'Article not found' });

            if (!['draft', 'pending', 'published', 'denied'].includes(req.body.status)) {
                return res.status(400).json({ message: 'Invalid status' });
            }

            article.status = req.body.status; 
            article.updatedAt = Date.now(); 
            await article.save();

            res.status(200).json(article);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    renderArticles: async (req, res) => {
        try {
            const articles = await Article.find()
                .populate('category', 'category_name')  
                .populate('author', 'username')  
                .lean();  
            console.log(articles); 

            res.render('admin/articles', {
                title: 'Quản lý bài viết',
                articles,

            });
        } catch (error) {
            console.error(error); 
            res.status(500).send('Lỗi khi tải trang bài viết.');  
        }
    },

    getCategories: async (req, res) => {
        try {
            const categories = await Category.find()
                .populate('parentId', 'category_name') 

            const categoriesWithArticleCount = await Promise.all(categories.map(async (category) => {
                const articleCount = await Article.countDocuments({ categoryId: category._id });
                return { ...category, articleCount }; 
            }));

            res.status(200).json({
                message: 'Danh sách chuyên mục',
                categories: categoriesWithArticleCount
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },


    addCategory: async (req, res) => {
        try {
            const { category_name, parentId } = req.body;

            if (!category_name) {
                return res.status(400).json({ message: 'Tên chuyên mục là bắt buộc' });
            }

            const newCategory = new Category({
                category_name,
                parentId
            });

            await newCategory.save();
            res.status(201).json({
                message: 'Chuyên mục đã được thêm thành công',
                category: newCategory
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    renderCategories: async (req, res) => {
        try {
            const categories = await Category.find();
            res.render('admin/categories', { title: 'Quản lý chuyên mục', categories });
        } catch (error) {
            res.status(500).send('Lỗi khi tải trang chuyên mục.');
        }
    },

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

    renderTags: async (req, res) => {
        try {
            const tags = await Tag.find();
            res.render('admin/tags', { title: 'Quản lý nhãn tag', tags });
        } catch (error) {
            res.status(500).send('Lỗi khi tải trang tag.');
        }
    },

    assignCategoryToEditor: async (req, res) => {
        try {
            const editor = await User.findById(req.params.editorId);
            if (!editor || editor.role !== 'editor') return res.status(404).json({ message: 'Editor not found' });

            editor.categories = req.body.categories;
            await editor.save();
            res.status(200).json(editor);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

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

    renderDashboard: async (req, res) => {
        try {
            const approvedPostsCount = await Article.countDocuments({ status: 'approved' });
            const pendingPostsCount = await Article.countDocuments({ status: 'pending' });
            const categoriesCount = await Category.countDocuments();
            const tagsCount = await Tag.countDocuments();
            const usersCount = await User.countDocuments();

            const recentArticles = await Article.find({ status: 'pending' }).limit(5);  

            res.render('admin/dashboard', {
                title: 'Dashboard',
                approvedPostsCount,
                pendingPostsCount,
                categoriesCount,
                tagsCount,
                usersCount,
                recentArticles 
            });
        } catch (error) {
            res.status(500).send('Error rendering dashboard');
        }
    },

    renderProfile: (req, res) => {
        res.render('admin/profile', { title: 'Cập nhật tài khoản', user: req.user });
    },
    getPendingArticles: async (req, res) => {
        try {
            const pendingArticles = await Article.find({ status: 'pending' });
            res.render('admin/articles', {
                title: 'Articles Pending Review',
                recentArticles: pendingArticles,
                approvedPostsCount: await Article.countDocuments({ status: 'approved' }),
                pendingPostsCount: pendingArticles.length,
                categoriesCount: 10, 
                tagsCount: 5, 
                usersCount: 100 
            });
        } catch (err) {
            console.error(err);
            res.status(500).send('Error while fetching pending articles.');
        }
    },

    publishArticle: async (req, res) => {
        const { id } = req.params;
        try {
            await Article.findByIdAndUpdate(id, { status: 'published' });
            res.redirect('/admin/articles');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error while updating the article.');
        }
    },
    denyArticle: async (req, res) => {
        const { id } = req.params;
        try {
            await Article.findByIdAndUpdate(id, { status: 'denied' });
            res.redirect('/admin/articles');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error while updating the article.');
        }
    },
    renderPendingArticles: async (req, res) => {
        try {
            const pendingArticles = await Article.find({ status: 'pending' });
            res.render('admin/articles', {
                title: 'Bài viết chờ duyệt',
                articles: pendingArticles,
            });
        } catch (error) {
            res.status(500).send('Lỗi khi tải bài viết chờ duyệt.');
        }
    },
    getArticleById: async (req, res) => {
        try {
            const articleId = req.params.id;
            
            const article = await Article.findById(articleId)
                .populate('category', 'category_name') 
                .populate('author', 'username') 
                .lean(); 
    
            if (!article) {
                return res.status(404).json({ message: 'Bài viết không tồn tại' });
            }
    
            res.status(200).json(article);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateArticle: async (req, res) => {
        try {
            const { title, content, tags, isPublished, thumbnail, note } = req.body;
    
            if (!title || !content) {
                return res.status(400).json({ message: 'Title and content are required.' });
            }
    
            const articleId = req.params.id;
            const article = await Article.findById(articleId);
            if (!article) return res.status(404).json({ message: 'Article not found' });
    
            article.title = title;
            article.content = content;
            article.tags = tags.split(",");  
            article.isPublished = isPublished;
            article.note = note;
    
            if (req.file) {
                article.thumbnail = req.file.path;
            }
    
            await article.save();
            res.redirect('/admin/articles');  
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    
    
    
    deleteArticle: async (req, res) => {
        try {
            const deletedArticle = await Article.findByIdAndDelete(req.params.id);
            if (!deletedArticle) return res.status(404).json({ message: 'Article not found' });
            res.redirect('/admin/dashboard');
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateCategory: async (req, res) => {
        try {
            const { category_name } = req.body;
            const categoryId = req.params.id;
    
            const category = await Category.findById(categoryId);
            if (!category) return res.status(404).json({ message: 'Category not found' });
    
            category.category_name = category_name;
    
            await category.save();
            res.redirect('/admin/categories');
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    
    
    deleteCategory: async (req, res) => {
        try {
            const deletedCategory = await Category.findByIdAndDelete(req.params.id);
            if (!deletedCategory) return res.status(404).json({ message: 'Category not found' });
            res.redirect('/admin/dashboard');
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateTag: async (req, res) => {
        try {
            const { tag_name } = req.body;
            const tagId = req.params.id;
    
            const tag = await Tag.findById(tagId);
            if (!tag) return res.status(404).json({ message: 'Tag not found' });
    
            tag.tag_name = tag_name;
    
            await tag.save();
            res.redirect('/admin/tags');
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    
    
    deleteTag: async (req, res) => {
        try {
            const deletedTag = await Tag.findByIdAndDelete(req.params.id);
            if (!deletedTag) return res.status(404).json({ message: 'Tag not found' });
            res.redirect('/admin/dashboard');
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    


};

module.exports = adminController;
