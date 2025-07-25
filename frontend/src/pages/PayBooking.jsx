import { useEffect, useState, useContext } from "react";
import { useParams, Navigate } from "react-router-dom";
import API from "../services/api";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckoutForm from "../components/StripeCheckoutForm";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { CalendarDays, Wallet } from "lucide-react";

const stripePromise = loadStripe("pk_test_51RiDqD2Ns7qSwDakd0DxfDHBlX6rdPy3XkFM57TZWGwRdAYNI87grMkSjmthsnQgivxp4A2ts1MduVRacG5AUpt000DPNTu9Em"); // Replace with your real key

const PayBooking = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data } = await API.get("/bookings/my");
        const found = data.find((b) => b._id === id);
        if (!found) {
          setError("Booking not found");
        } else {
          setBooking(found);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch booking");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  // Protect route: only logged in customers can access
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "customer") return <Navigate to="/" />;

  if (loading) return <div className="text-center py-10">Loading booking...</div>;
  if (error) return <div className="text-center text-red-600 py-10">{error}</div>;

  const formattedDate = new Date(booking.scheduledDate).toLocaleDateString();
  const selectedSub = booking.serviceId?.subServices?.find((s) => s.name === booking.subServiceName);
  const amount = selectedSub?.price || 499;

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-base-100 shadow-sm">
        <Navbar />
      </header>

      {/* Sidebar + Content */}
      <div className="flex flex-1 min-h-0">
        <aside className="w-64 hidden md:block bg-base-100 border-r border-base-300">
          <Sidebar />
        </aside>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-xl mx-auto bg-base-100 rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary flex items-center gap-2">
              <Wallet className="w-6 h-6" /> Pay for Booking
            </h2>

            <div className="mb-4 space-y-1">
              <p className="font-medium">
                <span className="text-gray-700">Service:</span> {booking.subServiceName}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                {formattedDate} at {booking.scheduledTime}
              </p>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <Elements stripe={stripePromise}>
                <StripeCheckoutForm bookingId={booking._id} amount={amount} />
              </Elements>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PayBooking;
