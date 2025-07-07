const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema(
    {
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        amount: { type: Number, required: true },
        method: { type: String, enum: ["card", "upi", "wallet", "cod"], required: true },
        transactionId: { type: String, required: true },
        status: { type: String, enum: ["success", "failed", "pending"], default: "pending" },
        paidAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
