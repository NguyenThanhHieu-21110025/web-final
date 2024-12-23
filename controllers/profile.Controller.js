const bcrypt = require('bcrypt');
const User = require('../models/user.Model');
const Article = require('../models/articleModel');

async function getProfile(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const userId = req.user._id;
        const user = await User.findById(userId);

        const topArticle = await Article.find({ author: userId })
            .sort({ views: -1 })
            .limit(1);

        const articles = await Article.find({ author: userId });

        res.render('user/profile', {
            user,
            topArticle: topArticle[0],
            articles,
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin profile', error: error.message });
    }
}

async function updateProfile(req, res) {
    try {
        const { full_name, pen_name, username, dateOfBirth, new_password, confirm_password } = req.body;
        const userId = req.user._id;

        const updateFields = {};

        if (new_password && new_password !== confirm_password) {
            return res.status(400).json({ message: 'Mật khẩu mới và mật khẩu xác nhận không khớp' });
        }

        if (full_name) updateFields.full_name = full_name;
        if (pen_name) updateFields.pen_name = pen_name;
        if (username) updateFields.username = username;
        if (dateOfBirth) updateFields.dateOfBirth = dateOfBirth;

        if (new_password) {
            const hashedPassword = await bcrypt.hash(new_password, 10);
            updateFields.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });

        res.redirect('/v1/profile');
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật thông tin', error: error.message });
    }
}

module.exports = {
    getProfile,
    updateProfile,
};
