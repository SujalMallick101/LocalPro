const express = require("express")
const router = express.Router()
const { createBooking, updateBookingStatus, getMyBookings } = require('../controllers/bookingController')
const { verifyToken, checkRole } = require('../middlewares/authMiddlewares')

// Customer books a service
router.post("/", verifyToken, checkRole(["customer"]), createBooking);

// Provider updates booking status
router.patch("/:id", verifyToken, checkRole(["provider"]), updateBookingStatus);

// View bookings (customer or provider)
router.get("/my", verifyToken, checkRole(["customer", "provider"]), getMyBookings);

module.exports = router;