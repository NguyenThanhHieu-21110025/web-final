const Article = require("../models/articleModel");
const User = require("../models/user.Model");
const puppeteer = require("puppeteer");
const path = require("path");
const ApiResponse = require("../utils/ApiReponse");
const authController = require("../controllers/auth.Controller");
const fs = require("fs");
const generatePDF = async (htmlContent, articleTitle) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlContent);

    await page.addStyleTag({
        content: `
            body { font-family: Arial, sans-serif; }
            h1 { color: #2c3e50; }
            p { font-size: 14px; }
            .footer { text-align: center; font-size: 12px; color: #aaa; }
        `,
    });
    const pdfDir = path.join(__dirname, '../pdfs');

    if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir, { recursive: true }); // Create the directory if it doesn't exist
    }
    const filePath = path.join(
        __dirname,
        "../pdfs",
        `${articleTitle.replace(/\s+/g, '_').replace(/\.\./g, '.')}.pdf`
    );
    console.log(filePath)
    await page.pdf({
        path: filePath,
        format: "A4",
        printBackground: true, // Ensure background is printed
        margin: {top: "20mm", bottom: "20mm", left: "10mm", right: "10mm"},
    });

    await browser.close();

    return filePath;
};

const subscriberController = {
    // Render trang các tùy chọn đăng ký
    getSubscriptionOptions: (req, res) => {
        res.render("subscriber/subscribe", {
            plans: [
                {name: "Monthly", price: 100000},
                {name: "Yearly", price: 1000000},
            ],
        });
    },
    profile: async (req, res) => {
        return res.render("subscriber/profile", {me: {...req.session.user, name: req.session.user.email[0]}});
    },
    subscribe: async (req, res, next) => {
        const user = await User.findById(req.session.user.userId);
        if (!user) {
            return ApiResponse.notFound(res, "User not found", 404);
        }
        const sevenDaysFromNow = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
        await User.findByIdAndUpdate(user._id, {
            subscriptionExpiry: sevenDaysFromNow,
            role: 'subscriber'
        });
        return authController.userLogout(req, res);
    },
    downloadArticle: async (req, res) => {
        try {
            if (!req.session.user) {
                return res.status(401).json({message: "Unauthorized"});
            }

            // Lấy thông tin người dùng
            const user = await User.findById(req.session.user.userId);
            if (!user) {
                return res.status(404).json({message: "User not found"});
            }

            // Kiểm tra ngày hết hạn
            if (new Date(user?.subscriptionExpiry) <= new Date()) {
                return res.status(403).json({message: "Subscription expired"});
            }

            // Lấy bài viết
            const article = await Article.findById(req.params.id);
            if (!article) {
                return res.status(404).json({message: "Article not found"});
            }
            //Gen PDF file
            const filePath = await generatePDF(article?.content, article?.title);
            // Tải file

            res.download(filePath, (err) => {
                if (err) {
                    return res
                        .status(500)
                        .json({message: "Error downloading file", error: err.message});
                }
            });
        } catch (err) {
            res
                .status(500)
                .json({message: "Internal server error", error: err.message});
        }
    },
};

module.exports = subscriberController;
