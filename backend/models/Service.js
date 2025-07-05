

const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    icon: { type: String }, // URL to image/icon
    subServices: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        duration: { type: String }, // e.g., "30 mins"
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
