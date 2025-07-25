const express = require("express")
const router = express.Router()
const { createReview, getProviderReviews,getCustomerReviews } = require("../controllers/reviewController");
const { verifyToken, checkRole } = require('../middlewares/authMiddlewares')

router.post("/", verifyToken, checkRole(["customer"]), createReview)
router.get("/provider/:id", getProviderReviews)//public route
router.get("/my", verifyToken, checkRole(["customer"]), getCustomerReviews);

module.exports = router