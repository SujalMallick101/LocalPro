import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { CalendarCheck, IndianRupee, Star } from "lucide-react";
import { Link } from "react-router-dom";

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await API.get("/bookings/my");
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings", err);
      }
    };

    if (user?.role === "customer") fetchBookings();
  }, [user?.role]);

  const upcoming = bookings.filter((b) => b.status !== "completed");
  const unpaid = bookings.filter((b) => b.paymentStatus === "pending");
  const reviewPending = bookings.filter(
    (b) =>
      b.status === "completed" &&
      b.paymentStatus === "paid" &&
      !b.reviewGiven
  );

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
              <div className="stat-title">Upcoming Bookings</div>
              <div className="stat-value text-primary">{upcoming.length}</div>
            </div>

            <div className="stat bg-base-100 shadow rounded-box border border-base-300">
              <div className="stat-figure text-secondary">
                <IndianRupee className="w-6 h-6" />
              </div>
              <div className="stat-title">Unpaid Bookings</div>
              <div className="stat-value text-red-500">{unpaid.length}</div>
            </div>

            <div className="stat bg-base-100 shadow rounded-box border border-base-300">
              <div className="stat-figure text-secondary">
                <Star className="w-6 h-6" />
              </div>
              <div className="stat-title">Pending Reviews</div>
              <div className="stat-value text-yellow-500">
                {reviewPending.length}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4">
            <Link to="/book-service" className="btn btn-primary btn-wide">
              Book a Service
            </Link>
            <Link to="/bookings" className="btn btn-outline btn-accent btn-wide">
              View My Bookings
            </Link>
            {reviewPending.length > 0 && (
              <Link
                to="/reviews"
                className="btn btn-outline btn-warning btn-wide"
              >
                Complete My Reviews
              </Link>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;
