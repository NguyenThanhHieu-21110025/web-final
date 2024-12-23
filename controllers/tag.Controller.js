const Tag = require('../models/tagModel');

// Thêm thẻ mới
exports.addTag = async (req, res) => {
  try {
    const { tag_name } = req.body;
    const tag = await Tag.create({ tag_name });
    res.status(201).json({ success: true, data: tag });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy danh sách thẻ
exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).json({ success: true, data: tags });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa thẻ
exports.deleteTag = async (req, res) => {
  try {
    const { tagId } = req.params;
    await Tag.findByIdAndDelete(tagId);
    res.status(200).json({ success: true, message: 'Tag deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
