import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import { Users, Wrench, ClipboardList } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalServices: 0,
    totalBookings: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get("/admin/stats");
        setStats(data);
      } catch (err) {
        console.error("Error fetching admin stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-base-100 shadow-sm">
        <Navbar />
      </header>

      {/* Sidebar + Main */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-64 hidden md:block bg-base-100 border-r border-base-300">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-primary mb-6">Admin Dashboard</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card bg-base-100 shadow border border-base-300 p-4">
              <div className="flex items-center gap-4">
                <Users className="w-10 h-10 text-primary" />
                <div>
                  <h4 className="text-lg font-semibold">Total Users</h4>
                  <p className="text-2xl">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow border border-base-300 p-4">
              <div className="flex items-center gap-4">
                <Wrench className="w-10 h-10 text-accent" />
                <div>
                  <h4 className="text-lg font-semibold">Total Services</h4>
                  <p className="text-2xl">{stats.totalServices}</p>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow border border-base-300 p-4">
              <div className="flex items-center gap-4">
                <ClipboardList className="w-10 h-10 text-info" />
                <div>
                  <h4 className="text-lg font-semibold">Total Bookings</h4>
                  <p className="text-2xl">{stats.totalBookings}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
