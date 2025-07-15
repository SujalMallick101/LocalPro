import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";

const StripeCheckoutForm = ({ bookingId, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: intent } = await API.post("/payments/stripe/create-intent", {
        bookingId,
        amount,
      });

      const result = await stripe.confirmCardPayment(intent.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        alert("Payment failed: " + result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        await API.post("/payments/stripe/confirm", {
          paymentIntentId: result.paymentIntent.id,
          bookingId,
          amount,
        });
        alert("Payment successful!");
        navigate("/bookings");
      }
    } catch (err) {
      console.error(err);
      alert("Payment failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-base-100 shadow-lg rounded space-y-5">
      <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
        <CreditCard className="w-6 h-6" /> Pay with Card
      </h2>

      <div className="p-4 border rounded bg-white">
        <CardElement />
      </div>

      <button
        type="submit"
        disabled={!stripe}
        className="btn btn-success w-full flex items-center justify-center gap-2"
      >
        <CreditCard className="w-4 h-4" />
        Pay ₹{amount}
      </button>
    </form>
  );
};

export default StripeCheckoutForm;
