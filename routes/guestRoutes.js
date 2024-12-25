const guestController = require('../controllers/guest.Controller')
const {ensureAuthenticated} = require("../middleware/auth.Middleware");

const router = require("express").Router();
router.get('/home', guestController.home);
router.get('/category/:id', guestController.getCategoryArticles);
router.get('/article/tag/:name', guestController.getTagArticles);
router.get('/article/:id', guestController.getArticleDetail);
router.get('/article-search', guestController.searchArticle);
router.post('/article/comment/:id', ensureAuthenticated, guestController.commentArticle)
module.exports = router;