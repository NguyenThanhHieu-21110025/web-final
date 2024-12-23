const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.Controller');
const middlewareController = require('../middleware/auth.Middleware');

// Route để lấy thông tin profile người dùng (cần xác thực token)
router.get('/profile', middlewareController.verifyToken, profileController.getProfile);

// Route để cập nhật thông tin người dùng (cần xác thực token)
router.post('/profile/update', middlewareController.verifyToken, profileController.updateProfile);

module.exports = router;
