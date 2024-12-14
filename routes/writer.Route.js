const writerController = require("../controllers/writer.Controller");
const middlewareController = require("../middleware/auth.Middleware");

const router = require("express").Router();

router.post("/", middlewareController.verifyToken, writerController.createArticle);
router.get("/", middlewareController.verifyToken, writerController.getArticle);
router.put("/:id", middlewareController.verifyToken, writerController.editArticle);

module.exports = router;