const userController = require("../controllers/user.Controller");

const router = require("express").Router();

router.get("/",  userController.getAllUsers );
router.get("/:id", userController.getUserById);
// router.put("/active/:id", middlewareController.verifyTokenAndAdminAuth, userController.isActive);
router.put("/:id",  userController.updateUser);  
router.delete("/:id",  userController.deleteUser);
router.post("/reset-password/:id",  userController.resetPassword);


module.exports = router;