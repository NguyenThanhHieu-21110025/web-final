const Media = require('../models/mediaModel');

// Upload tài nguyên
exports.uploadMedia = async (req, res) => {
  try {
    const { file_name, file_url, file_type, uploaded_by, associated_article_id } = req.body;
    const media = await Media.create({ file_name, file_url, file_type, uploaded_by, associated_article_id });
    res.status(201).json({ success: true, data: media });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy tài nguyên theo bài viết
exports.getMediaByArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const media = await Media.find({ associated_article_id: articleId });
    res.status(200).json({ success: true, data: media });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa tài nguyên
exports.deleteMedia = async (req, res) => {
  try {
    const { mediaId } = req.params;
    await Media.findByIdAndDelete(mediaId);
    res.status(200).json({ success: true, message: 'Media deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
