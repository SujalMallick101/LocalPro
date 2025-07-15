import { useEffect, useState, useContext } from "react";
import { Navigate, Link } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

// Lucide Icons
import { Calendar, Clock, User, IndianRupee } from "lucide-react";

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  if (!user) return <Navigate to="/login" />;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await API.get("/bookings/my");
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings", err);
    }
  };

  const updateStatus = async (bookingId, newStatus) => {
    try {
      await API.patch(`/bookings/${bookingId}`, { status: newStatus });
      await fetchBookings(); // refresh UI
    } catch (err) {
      alert("Failed to update booking status.");
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-base-200 py-10 px-4">
        <div className="max-w-4xl mx-auto bg-base-100 p-6 rounded-box shadow">
          <h2 className="text-3xl font-bold text-primary mb-6">My Bookings</h2>

          {bookings.length === 0 ? (
            <p className="text-center text-gray-500">No bookings yet.</p>
          ) : (
            <div className="space-y-6">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  className="card bg-white shadow-md border border-base-300"
                >
                  <div className="card-body space-y-2">
                    {/* Title & Status */}
                    <div className="flex justify-between items-center">
                      <h3 className="card-title text-lg text-primary">
                        {b.serviceId?.name} - {b.subServiceName}
                      </h3>
                      <div className="badge badge-outline badge-info capitalize">
                        {b.status}
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(b.scheduledDate).toLocaleDateString()}
                      </span>
                      <Clock className="w-4 h-4 ml-4" />
                      <span>{b.scheduledTime}</span>
                    </div>

                    {/* User */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>
                        {user.role === "customer"
                          ? `Provider: ${b.providerId?.name || "N/A"}`
                          : `Customer: ${b.customerId?.name || "N/A"}`}
                      </span>
                    </div>

                    {/* Payment Status */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <IndianRupee className="w-4 h-4" />
                      <span
                        className={`font-medium ${
                          b.paymentStatus === "pending"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </div>

                    {/* Pay Now Button (Customer) */}
                    {user.role === "customer" && b.paymentStatus === "pending" && (
                      <div>
                        <Link
                          to={`/pay/${b._id}`}
                          className="btn btn-sm btn-outline btn-primary mt-2"
                        >
                          Pay Now
                        </Link>
                      </div>
                    )}

                    {/* Leave Review Button (Customer) */}
                    {user.role === "customer" &&
                      b.status === "completed" &&
                      b.paymentStatus === "paid" &&
                      !b.reviewGiven && (
                        <div>
                          <Link
                            to={`/review/${b._id}`}
                            className="btn btn-sm btn-outline btn-secondary mt-2"
                          >
                            Leave a Review
                          </Link>
                        </div>
                      )}

                    {/* Provider Status Controls */}
                    {user.role === "provider" && (
                      <div className="mt-2 space-x-2">
                        {b.status === "pending" && (
                          <button
                            onClick={() => updateStatus(b._id, "accepted")}
                            className="btn btn-xs btn-outline btn-success"
                          >
                            Accept
                          </button>
                        )}
                        {b.status === "accepted" && (
                          <button
                            onClick={() => updateStatus(b._id, "in-progress")}
                            className="btn btn-xs btn-outline btn-warning"
                          >
                            Start Job
                          </button>
                        )}
                        {b.status === "in-progress" && (
                          <button
                            onClick={() => updateStatus(b._id, "completed")}
                            className="btn btn-xs btn-outline btn-primary"
                          >
                            Complete Job
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyBookings;
