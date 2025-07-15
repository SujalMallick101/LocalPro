import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  BookOpenCheck,
  Clock,
  ListChecks,
  User,
  CalendarCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const ProviderDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchProviderBookings = async () => {
      try {
        const { data } = await API.get("/bookings/my"); // Uses role: 'provider'
        setBookings(data);
      } catch (err) {
        console.error("Failed to load provider bookings", err);
      }
    };

    if (user.role === "provider") fetchProviderBookings();
  }, [user.role]);

  // Categorize bookings
  const completed = bookings.filter((b) => b.status === "completed");
  const inProgress = bookings.filter((b) => b.status === "in-progress");
  const upcoming = bookings.filter((b) => b.status === "pending" || b.status === "accepted");

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 bg-base-200 p-6">
        <Navbar />

        <h1 className="text-2xl font-bold text-primary mb-6">
          Welcome, {user.name}
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="stat bg-base-100 border border-base-300 rounded-box shadow">
            <div className="stat-figure text-secondary">
              <BookOpenCheck className="w-6 h-6" />
            </div>
            <div className="stat-title">Total Bookings</div>
            <div className="stat-value">{bookings.length}</div>
          </div>

          <div className="stat bg-base-100 border border-base-300 rounded-box shadow">
            <div className="stat-figure text-secondary">
              <ListChecks className="w-6 h-6" />
            </div>
            <div className="stat-title">In Progress</div>
            <div className="stat-value text-blue-600">{inProgress.length}</div>
          </div>

          <div className="stat bg-base-100 border border-base-300 rounded-box shadow">
            <div className="stat-figure text-secondary">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div className="stat-title">Completed</div>
            <div className="stat-value text-green-600">{completed.length}</div>
          </div>
        </div>

        {/* Upcoming Jobs List */}
        <div className="bg-base-100 p-4 rounded-box border border-base-300 shadow">
          <h2 className="text-lg font-semibold mb-3">Upcoming Jobs</h2>
          {upcoming.length === 0 ? (
            <p className="text-gray-500 text-sm">No upcoming jobs.</p>
          ) : (
            <ul className="space-y-3">
              {upcoming.slice(0, 5).map((b) => (
                <li key={b._id} className="p-3 rounded-lg bg-base-200 border border-base-300">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-primary">
                        {b.serviceId?.name} - {b.subServiceName}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(b.scheduledDate).toLocaleDateString()} at{" "}
                        {b.scheduledTime}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {b.customerId?.name || "Customer"}
                      </p>
                    </div>
                    <div className="badge badge-outline capitalize">
                      {b.status}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* View All */}
          <div className="mt-4">
            <Link to="/my-jobs" className="btn btn-sm btn-outline btn-primary">
              View All Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
