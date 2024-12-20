const adminMiddleware = (req, res, next) => {
    // Kiểm tra quyền admin từ thông tin người dùng trong request (được gán từ authMiddleware)
    if (req.user && req.user.role === 'administrator') {
        // Tiếp tục nếu là admin
        return next();
    }

    // Nếu không phải admin, trả về lỗi 403
    return res.status(403).json({ message: 'Permission denied: Admin access required!' });
};

module.exports = adminMiddleware;
