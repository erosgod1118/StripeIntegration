const router = require("express").Router();

const userController = require('../controllers/userController')
const { authorize } = require('../middleware/authMiddleware')
const { Roles } = require('../utils/authUtils')

router.post("/login", userController.loginUser)
router.post("/register", userController.registerUser)
router.get("/profile", authorize(Roles.All), userController.getUserProfile)
router.patch("/status", authorize(Roles.Admin), userController.updateUserStatus)
router.get("/logout", userController.logoutUser)

module.exports = router