const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
