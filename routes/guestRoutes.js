const guestController = require('../controllers/guest.Controller')

const router = require("express").Router();

router.get('/home', guestController.home);
router.get('/category/:id', guestController.getCategoryArticles);
router.get('/tag/:id', guestController.getTagArticles);
router.get('/article/:id', guestController.getArticleDetail);
router.get('/article/search', guestController.searchArticle);
// defined route o day


// voi phan home ( get route ) thi la trang giao dien
// con voi post hay gi do la api backend
module.exports = router;