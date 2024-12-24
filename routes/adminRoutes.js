const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.Controller');
const middlewareController = require('../middleware/auth.Middleware');

router.get('/api/users', adminController.getUsers);
router.get('/api/users/:id',  adminController.getUserById);
router.post('/api/users', adminController.addUser);
router.put('/api/users/:id/edit',  adminController.updateUser);
router.delete('/api/users/:id/delete',  adminController.deleteUser);
router.get('/admin/dashboard', adminController.renderDashboard);

router.get('/api/articles', adminController.getArticles); 
router.get('/api/articles/:id', adminController.getArticleById); 
router.put('/api/articles/:id/status', adminController.updateArticleStatus); 
router.get('/api/articles/pending', adminController.getPendingArticles); 

router.get('/api/categories', adminController.getCategories);
router.post('/api/categories', adminController.addCategory);

router.get('/api/tags', adminController.getTags);
router.post('/api/tags', adminController.addTag);

router.put('/api/assign-category/:editorId', adminController.assignCategoryToEditor);

router.put('/api/extend-subscription/:id', adminController.extendSubscription);

router.get('/dashboard', adminController.renderDashboard); 

router.get('/users', adminController.renderUsers); 

router.get('/categories', adminController.renderCategories); 

router.get('/tags', adminController.renderTags); 

router.get('/articles', adminController.renderArticles); 
router.get('/articles/pending', adminController.renderPendingArticles); 

router.get('/profile', adminController.renderProfile); 

router.put('/articles/:id/publish', adminController.publishArticle); 
router.put('/articles/:id/deny', adminController.denyArticle); 

module.exports = router;
