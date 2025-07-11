const Review = require('../models/Review')
const Booking = require('../models/Bookings')

// Create a review (only after completed booking)
exports.createReview = async (req, res) => {
    try {
        const { bookingId, rating, comment } = req.body
        const booking = await Booking.findById(bookingId)
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" })
        }
        if (booking.customerId.toString() !== req.user.userId || booking.status !== "completed") {
            return res.status(403).json({ message: "Unauthorized to review" })
        }
        const alreadyReviwed = await Review.findOne(bookingId)
        if (alreadyReviwed) {
            return res.status(400).json({ message: "Already Reviwed" })
        }
        const review = await Review.create({
            bookingId,
            customerId: req.user.userId,
            providerId: booking.providerId,
            rating,
            comment,
        })
        booking.reviewGiven = true
        await booking.save()

        return res.status(201).json({ message: "Review submitted" }, review)
    } catch (err) {
        res.status(500).json({ message: "Failed to submit review", error: err });
    }
}

// Get all reviews for a provider
exports.getProviderReviews = async (req, res) => {
    try {
        const providerId = req.params.id;

        const reviews = await Review.find({ providerId })
            .populate("customerId", "name")
            .sort({ createdAt: -1 });

        const averageRating =
            reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);

        res.json({
            providerId,
            averageRating: averageRating.toFixed(1),
            totalReviews: reviews.length,
            reviews,
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch reviews", error: err });
    }
};