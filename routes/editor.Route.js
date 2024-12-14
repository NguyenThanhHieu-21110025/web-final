const editorController = require("../controllers/editor.Controller");
const middlewareController = require("../middleware/auth.Middleware");

const router = require("express").Router();

router.get("/drafts", middlewareController.verifyToken, editorController.getDraftArticles);
router.get("/approve/:id", middlewareController.verifyToken, editorController.approveArticle);
router.get("/reject/:id", middlewareController.verifyToken, editorController.rejectArticle);

module.exports = router;