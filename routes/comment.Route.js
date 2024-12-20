const { addComment, getCommentsByArticle, deleteComment } = require('../controllers/comment.Controller');

const router = require("express").Router();


router.post('/comments', addComment); // Thêm bình luận
router.get('/comments/article/:articleId', getCommentsByArticle); // Lấy bình luận theo bài viết
router.delete('/comments/:commentId', deleteComment); // Xóa bình luận

module.exports = router;
