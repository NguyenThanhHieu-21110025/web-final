const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.Controller");
const {body, validationResult} = require("express-validator"); // Ensure 'express-validator' is installed

// Đăng ký người dùng
router.post(
    "/register",
    [
        body("email").isEmail().withMessage("Please enter a valid email"),
        body("password").isLength({min: 6}).withMessage("Password must be at least 6 characters")
    ],
    async (req, res) => {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        await authController.registerUser(req, res);
    }
);

// Đăng nhập người dùng
router.post("/login", async (req, res) => {
    await authController.loginUser(req, res);
});
router.get("/login", async (req, res) => {
    return res.render('guest/login');
})

// Yêu cầu Refresh Token
router.post("/refresh", async (req, res) => {
    await authController.requestRefreshToken(req, res);
});

// Đăng xuất người dùng
router.post("/logout", async (req, res) => {
    await authController.userLogout(req, res);
});

// Xóa người dùng
router.delete("/delete/:id", async (req, res) => {
    await authController.deleteUser(req, res);
});

module.exports = router;
