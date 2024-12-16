const authController = require("../controllers/auth.Controller");
const middlewareController = require("../middleware/auth.Middleware");

const router = require("express").Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/refresh", authController.requestRefreshToken);
router.delete("/:id",middlewareController.verifyTokenAndAdminAuth, authController.deleteUsers);
router.post("/logout",middlewareController.verifyToken, authController.userLogout);

module.exports = router;