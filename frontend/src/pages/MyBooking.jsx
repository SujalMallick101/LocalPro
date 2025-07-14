import { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
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
    const fetchBookings = async () => {
      try {
        const { data } = await API.get("/bookings/my");
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings", err);
      }
    };
    fetchBookings();
  }, []);

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
                    <div className="flex justify-between items-center">
                      <h3 className="card-title text-lg text-primary">
                        {b.serviceId?.name} - {b.subServiceName}
                      </h3>
                      <div className="badge badge-outline badge-info capitalize">
                        {b.status}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(b.scheduledDate).toLocaleDateString()}
                      </span>
                      <Clock className="w-4 h-4 ml-4" />
                      <span>{b.scheduledTime}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>
                        {user.role === "customer"
                          ? `Provider: ${b.providerId?.name}`
                          : `Customer: ${b.customerId?.name}`}
                      </span>
                    </div>

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

                    {user.role === "customer" &&
                      b.paymentStatus === "pending" && (
                        <div>
                          <a
                            href={`/pay/${b._id}`}
                            className="btn btn-sm btn-outline btn-primary mt-2"
                          >
                            Pay Now
                          </a>
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
