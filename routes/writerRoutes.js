const writerController = require("../controllers/writerController.js");

const router = require("express").Router();
// api routes
router.get("/get-my-article",  writerController.getMyPost);
router.post("/new-article",  writerController.postArticle);
router.put("/:id",  writerController.updateMyPost);
router.delete("/:id",  writerController.deleteMyPost);
// view routes
router.get("/my-article",  writerController.viewMyPost);
// NOTE  : u can add your custom view here
module.exports = router;