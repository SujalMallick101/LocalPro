const express = require("express");
const router = express.Router();

const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService
} = require("../controllers/serviceController");

const { verifyToken, checkRole } = require("../middlewares/authMiddlewares");

// Public Routes
router.get("/", getServices);
router.get("/:id", getServiceById);

// Admin-Only Routes
router.post("/", verifyToken, checkRole(["admin"]), createService);
router.put("/:id", verifyToken, checkRole(["admin"]), updateService);
router.delete("/:id", verifyToken, checkRole(["admin"]), deleteService);

module.exports = router;
