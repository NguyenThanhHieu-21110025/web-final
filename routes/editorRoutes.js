const middlewareController = require("../middleware/auth.Middleware");
const {
    editArticle,
    getAllWriterArticle,
    deniedArticle,
    verifyArticle,
    allWriterArticleView
} = require("../controllers/editorController");

const router = require("express").Router();
// api routes
router.get("/get-all-article", middlewareController.verifyToken, getAllWriterArticle);
router.put("/edit-article/:id", middlewareController.verifyToken, editArticle);
router.put("/verify-article/:id", middlewareController.verifyToken, verifyArticle);
router.delete("/denied-article/:id", middlewareController.verifyToken, deniedArticle);
// view routes
router.get("/writer-article", allWriterArticleView);
// NOTE  : u can add your custom view here
module.exports = router;