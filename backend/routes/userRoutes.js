const express = require("express");
const router = express.Router();
const { getAllUsers } = require("../controllers/adminControllers");

// ✅ Public access to fetch providers
router.get("/", getAllUsers); // GET /api/users?role=provider

module.exports = router;
