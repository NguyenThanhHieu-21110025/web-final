const express = require('express');
const { addTag, getAllTags, deleteTag } = require('../controllers/tag.Controller');
const router = express.Router();

router.post('/tags', addTag); // Thêm thẻ
router.get('/tags', getAllTags); // Lấy danh sách thẻ
router.delete('/tags/:tagId', deleteTag); // Xóa thẻ

module.exports = router;
