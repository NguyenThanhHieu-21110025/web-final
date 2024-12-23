const Comment = require('../models/commentModel');

// Thêm bình luận
exports.addComment = async (req, res) => {
  try {
    const { article_id, user_name, content } = req.body;
    const comment = await Comment.create({ article_id, user_name, content });
    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy danh sách bình luận theo bài viết
exports.getCommentsByArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const comments = await Comment.find({ article_id: articleId }).sort({ created_at: -1 });
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa bình luận
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
