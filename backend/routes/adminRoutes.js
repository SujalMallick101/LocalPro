const express = require("express");
const router = express.Router();
const {
    getAllUsers,
    toggleUserStatus,
    getAdminStats,
    getAllServices,
} = require("../controllers/adminControllers");

const { verifyToken, checkRole } = require("../middlewares/authMiddlewares");

router.get("/users", verifyToken,checkRole(["admin"]), getAllUsers);
router.patch("/users/:id/status", verifyToken, checkRole(["admin"]), toggleUserStatus);
router.get("/stats", verifyToken, checkRole(["admin"]), getAdminStats);
router.get("/services", verifyToken, checkRole(["admin","customer"]), getAllServices);

module.exports = router;
