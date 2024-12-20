const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  file_name: {
    type: String,
    required: true,
    trim: true,
  },
  file_url: {
    type: String,
    required: true,
  },
  file_type: {
    type: String, // Ví dụ: 'image', 'video', 'document'
    required: true,
  },
  uploaded_by: {
    type: String,
    required: true,
    trim: true,
  },
  associated_article_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article', // Nếu tài nguyên gắn với bài viết
  },
}, {
  timestamps: true,
});

const Media = mongoose.model('Media', mediaSchema);
module.exports = Media;
