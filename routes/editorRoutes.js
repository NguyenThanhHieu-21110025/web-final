const {
    editArticle,
    getAllWriterArticle,
    deniedArticle,
    verifyArticle, getArticle,
    allWriterArticleView
} = require("../controllers/editorController");
const {ensureAuthenticated, checkEditor} = require("../middleware/auth.Middleware");

const router = require("express").Router();
// api routes
router.get("/get-all-article", getAllWriterArticle);
router.put("/edit-article/:id", editArticle);
router.get("/verify-article/:id", verifyArticle);
router.post("/denied-article/:id", deniedArticle);
// view routes
router.get("/profile", ensureAuthenticated, allWriterArticleView);


// NOTE  : u can add your custom view here
router.get("/get-article-by-id/:id", ensureAuthenticated, getArticle);
module.exports = router;