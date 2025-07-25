const express = require("express");
const router = express.Router();

const { verifyToken, checkRole } = require("../middlewares/authMiddlewares");

const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService
} = require("../controllers/serviceController");

// Public Routes
router.get("/", getServices);
router.get("/:id", getServiceById);

// Provider: Create Service
router.post("/", verifyToken, checkRole(["provider"]), createService);

// Admin: Update/Delete
router.put("/:id", verifyToken, checkRole(["admin"]), updateService);
router.delete("/:id", verifyToken, checkRole(["admin"]), deleteService);

module.exports = router;
