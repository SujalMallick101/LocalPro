const Review = require('../models/Review');
const Booking = require('../models/Bookings');

// ✅ Create a review (only after completed booking)
exports.createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // ✅ Ensure booking belongs to this user and is completed
    if (booking.customerId.toString() !== req.user.userId || booking.status !== "completed") {
      return res.status(403).json({ message: "Unauthorized to review" });
    }

    // ✅ Prevent duplicate reviews for the same booking
    const alreadyReviewed = await Review.findOne({ bookingId });
    if (alreadyReviewed) {
      return res.status(400).json({ message: "Already reviewed" });
    }

    // ✅ Create and save review
    const review = await Review.create({
      bookingId,
      customerId: req.user.userId,
      providerId: booking.providerId,
      rating,
      comment,
    });

    // ✅ Update booking to mark review given
    booking.reviewGiven = true;
    await booking.save();

    return res.status(201).json({
      message: "Review submitted successfully",
      review,
    });

  } catch (err) {
    console.error("Review Error:", err);
    res.status(500).json({ message: "Failed to submit review", error: err.message });
  }
};

// ✅ Get all reviews for a specific provider
exports.getProviderReviews = async (req, res) => {
  try {
    const providerId = req.params.id;
    console.log("Getting reviews for provider:", providerId);

    if (!providerId) {
      return res.status(400).json({ message: "Provider ID is required" });
    }

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
    console.error("Fetch Review Error:", err);
    res.status(500).json({ message: "Failed to fetch reviews", error: err.message });
  }
};


// ✅ Get reviews by the logged-in customer
exports.getCustomerReviews = async (req, res) => {
  try {
    const customerId = req.user.userId;

    const reviews = await Review.find({ customerId })
      .populate("providerId", "name email")
      .populate("bookingId", "subServiceName scheduledDate scheduledTime")
      .sort({ createdAt: -1 });

    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your reviews", error: err.message });
  }
};

