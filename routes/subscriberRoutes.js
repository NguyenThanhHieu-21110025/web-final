const express = require('express');
const router = express.Router();
const subscriberController = require('../controllers/subscriberController');
const checkSubscription = require('../middleware/checkSubscription');

// Route cho trang tùy chọn đăng ký
router.get('/subscribe', subscriberController.getSubscriptionOptions);

// Route để tải bài viết (chỉ dành cho người dùng có đăng ký hợp lệ)
router.get('/download/:id', checkSubscription, subscriberController.downloadArticle);

module.exports = router;
