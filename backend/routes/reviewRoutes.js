const express = require("express")
const router = express.Router()
const { createReview, getProviderReviews } = require("../controllers/reviewController");
const { verifyToken, checkRole } = require('../middlewares/authMiddlewares')

router.post("/", verifyToken, checkRole(["customer"]), createReview)
router.post("/:id", getProviderReviews)//public route

module.exports = router