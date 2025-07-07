const express = require("express")
const router = express.Router()
const {createStripePaymentIntent,confirmStripePayment}=require("../controllers/paymentController")
const {verifyToken,checkRole}=require("../middlewares/authMiddlewares")

router.post("/stripe/create-intent", verifyToken, checkRole(["customer"]), createStripePaymentIntent);
router.post("/stripe/confirm", verifyToken, checkRole(["customer"]), confirmStripePayment);

module.exports=router