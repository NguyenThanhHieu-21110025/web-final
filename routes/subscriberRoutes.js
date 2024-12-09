const express = require('express');
const router = express.Router();
const subscriberController = require('../controllers/subscriberController');
const middlewareController = require("../middleware/auth.Middleware");

router.get('/subscribe', subscriberController.getSubscriptionOptions);
router.get('/download/:id',middlewareController.isAuthenticated, subscriberController.downloadArticle);

module.exports = router;
