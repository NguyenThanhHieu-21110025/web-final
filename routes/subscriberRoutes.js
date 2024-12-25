const express = require('express');
const router = express.Router();
const subscriberController = require('../controllers/subscriberController');
const {ensureAuthenticated} = require("../middleware/auth.Middleware");

// Route cho trang tùy chọn đăng ký
router.get('/subscribe', ensureAuthenticated, subscriberController.getSubscriptionOptions);
router.post("/subscribe", ensureAuthenticated, subscriberController.subscribe);
// Route để tải bài viết (chỉ dành cho người dùng có đăng ký hợp lệ)
router.get('/download/:id', ensureAuthenticated, subscriberController.downloadArticle);

router.get("/profile", ensureAuthenticated, subscriberController.profile);
module.exports = router;
