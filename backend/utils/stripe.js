// backend/utils/stripe.js
require("dotenv").config();           // <‑‑ guarantees .env is loaded
const Stripe = require("stripe");

if (!process.env.STRIPE_SECRET_KEY) {
  console.error("⛔  STRIPE_SECRET_KEY missing – check your .env file");
  process.exit(1);
}

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
module.exports = stripe;
