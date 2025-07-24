import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  CalendarCheck,
  ListChecks,
  BookOpenCheck,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";

const ProviderDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchProviderBookings = async () => {
      try {
        const { data } = await API.get("/bookings/my");
        setBookings(data);
      } catch (err) {
        console.error("Error fetching provider bookings", err);
      }
    };

    if (user?.role === "provider") fetchProviderBookings();
  }, [user?.role]);

  const upcoming = bookings.filter(
    (b) => b.status === "pending" || b.status === "accepted"
  );
  const inProgress = bookings.filter((b) => b.status === "in-progress");
  const completed = bookings.filter((b) => b.status === "completed");

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      {/* ✅ Navbar stays on top */}
      <header className="sticky top-0 z-50 bg-base-100 shadow-sm">
        <Navbar />
      </header>

      {/* ✅ Content area: sidebar + main */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar starts below Navbar */}
        <aside className="w-64 hidden md:block bg-base-100 border-r border-base-300">
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold text-primary mb-6">
            Welcome back, {user?.name}
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="stat bg-base-100 shadow rounded-box border border-base-300">
              <div className="stat-figure text-secondary">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <div className="stat-title">Upcoming Jobs</div>
              <div className="stat-value text-primary">{upcoming.length}</div>
            </div>

            <div className="stat bg-base-100 shadow rounded-box border border-base-300">
              <div className="stat-figure text-secondary">
                <ListChecks className="w-6 h-6" />
              </div>
              <div className="stat-title">Jobs In Progress</div>
              <div className="stat-value text-blue-500">{inProgress.length}</div>
            </div>

            <div className="stat bg-base-100 shadow rounded-box border border-base-300">
              <div className="stat-figure text-secondary">
                <BookOpenCheck className="w-6 h-6" />
              </div>
              <div className="stat-title">Completed Jobs</div>
              <div className="stat-value text-green-500">{completed.length}</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4">
            <Link to="/my-jobs" className="btn btn-primary btn-wide">
              View All Jobs
            </Link>
            <Link to="/profile" className="btn btn-outline btn-accent btn-wide">
              Update Profile
            </Link>
            {/* <Link to="/services" className="btn btn-outline btn-info btn-wide">
              Manage Services
            </Link> */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProviderDashboard;
