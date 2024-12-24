const {
    editArticle,
    getAllWriterArticle,
    deniedArticle,
    verifyArticle,
    allWriterArticleView
} = require("../controllers/editorController");

const router = require("express").Router();
// api routes
router.get("/get-all-article",  getAllWriterArticle);
router.put("/edit-article/:id",  editArticle);
router.put("/verify-article/:id",  verifyArticle);
router.delete("/denied-article/:id",  deniedArticle);
// view routes
router.get("/writer-article",  allWriterArticleView);
// NOTE  : u can add your custom view here
module.exports = router;