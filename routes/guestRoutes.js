const guestController = require('../controllers/guest.Controller')

const router = require("express").Router();
router.get('/home', guestController.home);
router.get('/category/:id', guestController.getCategoryArticles);
router.get('/article/tag/:name', guestController.getTagArticles);
router.get('/article/:id', guestController.getArticleDetail);
router.get('/article-search', guestController.searchArticle);
module.exports = router;