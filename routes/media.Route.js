const express = require('express');
const { uploadMedia, getMediaByArticle, deleteMedia } = require('../controllers/media.Controller');
const router = express.Router();

router.post('/media', uploadMedia); // Upload tài nguyên
router.get('/media/article/:articleId', getMediaByArticle); // Lấy tài nguyên theo bài viết
router.delete('/media/:mediaId', deleteMedia); // Xóa tài nguyên

module.exports = router;
