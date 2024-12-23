const writerController = require("../controllers/writerController.js");
const middlewareController = require("../middleware/auth.Middleware");

const router = require("express").Router();
// api routes
router.get("/get-my-article", middlewareController.verifyToken, writerController.getMyPost);
router.post("/new-article", middlewareController.verifyToken, writerController.postArticle);
router.put("/:id", middlewareController.verifyToken, writerController.updateMyPost);
router.delete("/:id", middlewareController.verifyToken, writerController.deleteMyPost);
// view routes
router.get("/my-article", middlewareController.isAuthenticated, writerController.viewMyPost);
// NOTE  : u can add your custom view here
module.exports = router;