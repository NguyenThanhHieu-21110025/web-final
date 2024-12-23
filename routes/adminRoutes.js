const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.Controller');
const middlewareController= require('../middleware/auth.Middleware');
// const adminMiddleware = require('../middleware/admin.Middleware');


// Quản lý người dùng
router.get('/users',  middlewareController.verifyTokenAndAdminAuth , adminController.getUsers);
router.get('/users/:id', middlewareController.verifyTokenAndAdminAuth , adminController.getUserById);
router.post('/users', middlewareController.verifyTokenAndAdminAuth , adminController.addUser);
router.put('/users/:id', middlewareController.verifyTokenAndAdminAuth , adminController.updateUser);
router.delete('/users/:id', middlewareController.verifyTokenAndAdminAuth , adminController.deleteUser);

// Quản lý bài viết
router.get('/articles', middlewareController.verifyTokenAndAdminAuth , adminController.getArticles);
router.put('/articles/:id/status', middlewareController.verifyTokenAndAdminAuth , adminController.updateArticleStatus);

// Quản lý chuyên mục
router.get('/categories', middlewareController.verifyTokenAndAdminAuth , adminController.getCategories);
router.post('/categories', middlewareController.verifyTokenAndAdminAuth , adminController.addCategory);

// Quản lý nhãn
router.get('/tags', middlewareController.verifyTokenAndAdminAuth , adminController.getTags);
router.post('/tags', middlewareController.verifyTokenAndAdminAuth , adminController.addTag);

// Phân công chuyên mục cho biên tập viên
router.put('/assign-category/:editorId', middlewareController.verifyTokenAndAdminAuth , adminController.assignCategoryToEditor);

// Gia hạn tài khoản độc giả
router.put('/extend-subscription/:id', middlewareController.verifyTokenAndAdminAuth , adminController.extendSubscription);

module.exports = router;
