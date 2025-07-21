import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Calendar, User, Star } from "lucide-react";

const Reviews = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  if (!user) return <Navigate to="/login" />;
  if (user.role !== "customer") return <Navigate to="/" />;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await API.get("/bookings/my");
        const filtered = data.filter(
          (b) =>
            b.status === "completed" &&
            b.paymentStatus === "paid" &&
            !b.reviewGiven
        );
        setBookings(filtered);
      } catch (err) {
        console.error("Error fetching reviews", err);
      }
    };

    fetchBookings();
  }, []);

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
              Pending Reviews
            </h2>

            {bookings.length === 0 ? (
              <p className="text-center text-gray-500">No reviews pending.</p>
            ) : (
              <div className="space-y-6">
                {bookings.map((b) => (
                  <div
                    key={b._id}
                    className="card bg-white shadow-md border border-base-300"
                  >
                    <div className="card-body space-y-2">
                      {/* Title */}
                      <h3 className="card-title text-lg text-primary">
                        {b.serviceId?.name} - {b.subServiceName}
                      </h3>

                      {/* Date */}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(b.scheduledDate).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Provider */}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{b.providerId?.name || "N/A"}</span>
                      </div>

                      {/* Leave Review Button */}
                      <Link
                        to={`/review/${b._id}`}
                        className="btn btn-sm btn-outline btn-primary mt-2 flex items-center gap-2"
                      >
                        <Star className="w-4 h-4" />
                        Leave Review
                      </Link>
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

export default Reviews;
