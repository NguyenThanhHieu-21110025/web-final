const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.Controller");
const { body, validationResult } = require("express-validator"); // Ensure 'express-validator' is installed
const passport = require("../controllers/passport");

// Route đăng ký người dùng
router.get('/register', (req, res) => {
    res.render('guest/register'); // Hiển thị form đăng ký
});

router.post('/register', authController.registerUser); // Xử lý đăng ký


router.get('/login', (req, res) => {
    res.render('guest/login');
});

router.post('/login', authController.loginUser);




// Đăng xuất người dùng
router.post("/logout", async (req, res) => {
    await authController.userLogout(req, res);
});

// Xóa người dùng
router.delete("/delete/:id", async (req, res) => {
    await authController.deleteUser(req, res);
});

// Đăng nhập qua Facebook
router.get('/facebook', passport.authenticate('facebook'));

// Callback sau khi đăng nhập qua Facebook
router.get('/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/',
    successRedirect: '/dashboard'
}));

// Đăng nhập qua Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback sau khi đăng nhập qua Google
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/',
    successRedirect: '/dashboard'
}));

module.exports = router;
