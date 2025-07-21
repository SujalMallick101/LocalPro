import { useEffect, useState, useContext } from "react";
import { Navigate, Link } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  Calendar,
  Clock,
  User,
  IndianRupee,
  CheckCircle,
  Star,
} from "lucide-react";

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
      await fetchBookings();
    } catch (err) {
      alert("Failed to update booking status.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-base-100 shadow-sm">
        <Navbar />
      </header>

      {/* Layout */}
      <div className="flex flex-1 min-h-0">
        <aside className="w-64 hidden md:block bg-base-100 border-r border-base-300">
          <Sidebar />
        </aside>

        <main className="flex-1 py-10 px-4">
          <div className="max-w-4xl mx-auto bg-base-100 p-6 rounded-box shadow">
            <h2 className="text-3xl font-bold text-primary mb-6">
              My Bookings
            </h2>

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

                      {/* User Role Display */}
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

                      {/* Customer Buttons */}
                      {user.role === "customer" && (
                        <div className="flex gap-2 flex-wrap mt-2">
                          {b.paymentStatus === "pending" && (
                            <Link
                              to={`/pay/${b._id}`}
                              className="btn btn-sm btn-outline btn-primary"
                            >
                              <IndianRupee className="w-4 h-4" />
                              Pay Now
                            </Link>
                          )}
                          {b.status === "completed" &&
                            b.paymentStatus === "paid" &&
                            !b.reviewGiven && (
                              <Link
                                to={`/review/${b._id}`}
                                className="btn btn-sm btn-outline btn-warning"
                              >
                                <Star className="w-4 h-4" />
                                Leave Review
                              </Link>
                            )}
                        </div>
                      )}

                      {/* Provider Buttons */}
                      {user.role === "provider" && (
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {b.status === "pending" && (
                            <button
                              onClick={() => updateStatus(b._id, "accepted")}
                              className="btn btn-xs btn-outline btn-success"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Accept
                            </button>
                          )}
                          {b.status === "accepted" && (
                            <button
                              onClick={() =>
                                updateStatus(b._id, "in-progress")
                              }
                              className="btn btn-xs btn-outline btn-warning"
                            >
                              Start Job
                            </button>
                          )}
                          {b.status === "in-progress" && (
                            <button
                              onClick={() =>
                                updateStatus(b._id, "completed")
                              }
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
        </main>
      </div>
    </div>
  );
};

export default MyBookings;
