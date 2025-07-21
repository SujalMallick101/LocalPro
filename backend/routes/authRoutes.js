const express = require("express");
const router = express.Router();
const { register, login, getCurrentUser } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddlewares");

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getCurrentUser); // ⬅️ NEW

module.exports = router;
