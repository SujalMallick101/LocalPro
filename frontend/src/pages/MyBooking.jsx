import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate,Navigate } from "react-router-dom";

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
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="border rounded p-4 shadow-sm bg-white">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">
                  {b.serviceId?.name} - {b.subServiceName}
                </h3>
                <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-600">
                  {b.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Scheduled for: {new Date(b.scheduledDate).toLocaleDateString()} at {b.scheduledTime}
              </p>
              <p className="text-sm text-gray-600">
                {user.role === "customer"
                  ? `Provider: ${b.providerId?.name}`
                  : `Customer: ${b.customerId?.name}`}
              </p>
              <p className="text-sm mt-1">Payment: {b.paymentStatus}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
