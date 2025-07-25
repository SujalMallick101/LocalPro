const express = require("express");
const router = express.Router();
const { register, login, getCurrentUser,updateProfile } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddlewares");


router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getCurrentUser); // ⬅️ NEW
router.put("/me", verifyToken, updateProfile);


module.exports = router;
