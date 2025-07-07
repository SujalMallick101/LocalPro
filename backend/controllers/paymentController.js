const stripe = require("../utils/stripe");
const Booking = require("../models/Bookings");
const Payment = require("../models/Payment");

// 1️⃣ Create Stripe Payment Intent
exports.createStripePaymentIntent = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // amount in cents
      currency: "inr",
      metadata: {
        bookingId: booking._id.toString(),
        customerId: req.user.userId,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create Stripe PaymentIntent", error: err });
  }
};

// 2️⃣ Record Stripe Payment After Confirmation
exports.confirmStripePayment = async (req, res) => {
  try {
    const { paymentIntentId, bookingId, amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ message: "Payment not successful" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.paymentStatus = "paid";
    await booking.save();

    const payment = await Payment.create({
      bookingId,
      customerId: req.user.userId,
      providerId: booking.providerId,
      amount,
      method: "stripe",
      transactionId: paymentIntentId,
      status: "success",
    });

    res.status(201).json({ message: "Payment confirmed and saved", payment });
  } catch (err) {
    res.status(500).json({ message: "Payment confirmation failed", error: err });
  }
};