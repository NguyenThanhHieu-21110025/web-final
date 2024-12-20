const guestController = require('../controllers/guest.Controller')

const router = require("express").Router();

router.get('/home', guestController.home );
router.get('/category/:id', guestController.getCategoryArticles);
router.get('/tag/:id', guestController.getTagArticles);
router.get('/article/:id', guestController.getArticleDetail);

module.exports = router;