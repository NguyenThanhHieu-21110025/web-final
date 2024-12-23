const User = require('../models/user.Model');

const checkSubscription = async (req, res, next) => {
    try {
        // Kiểm tra nếu người dùng đã đăng nhập
        if (!req.user) {
            return res.status(401).render('errors/401', { message: 'Please log in to continue.' });
        }

        // Lấy thông tin người dùng từ cơ sở dữ liệu
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).render('errors/404', { message: 'User not found.' });
        }

        // Kiểm tra ngày hết hạn đăng ký
        if (new Date(user.subscription_expiry) <= new Date()) {
            return res.status(403).render('errors/403', { message: 'Your subscription has expired. Please renew to access this feature.' });
        }

        // Nếu hợp lệ, cho phép tiếp tục
        next();
    } catch (err) {
        return res.status(500).render('errors/500', { message: 'Internal server error.', error: err.message });
    }
};

module.exports = checkSubscription;
