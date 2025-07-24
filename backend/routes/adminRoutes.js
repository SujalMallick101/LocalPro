const express = require("express");
const router = express.Router();
const { getAllUsers, toggleUserStatus, getAdminStats, getAllServices } = require("../controllers/adminControllers");
const { verifyToken, checkRole } = require("../middlewares/authMiddlewares");

router.use(verifyToken, checkRole("admin"));

router.get("/users", getAllUsers);
router.patch("/users/:id/status", toggleUserStatus);
router.get("/stats", getAdminStats);
router.get("/services", getAllServices);

module.exports = router;
