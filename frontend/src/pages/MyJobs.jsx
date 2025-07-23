import { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
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
} from "lucide-react";

const MyJobs = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);

  if (!user) return <Navigate to="/login" />;
  if (user.role !== "provider") return <Navigate to="/" />;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await API.get("/bookings/my");
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs", err);
    }
  };

  const updateStatus = async (bookingId, newStatus) => {
    try {
      await API.patch(`/bookings/${bookingId}`, { status: newStatus });
      await fetchJobs();
    } catch (err) {
      alert("Failed to update job status.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <header className="sticky top-0 z-50 bg-base-100 shadow-sm">
        <Navbar />
      </header>

      <div className="flex flex-1 min-h-0">
        <aside className="w-64 hidden md:block bg-base-100 border-r border-base-300">
          <Sidebar />
        </aside>

        <main className="flex-1 py-10 px-4">
          <div className="max-w-4xl mx-auto bg-base-100 p-6 rounded-box shadow">
            <h2 className="text-3xl font-bold text-primary mb-6">My Jobs</h2>

            {jobs.length === 0 ? (
              <p className="text-center text-gray-500">No jobs assigned yet.</p>
            ) : (
              <div className="space-y-6">
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className="card bg-white shadow-md border border-base-300"
                  >
                    <div className="card-body space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="card-title text-lg text-primary">
                          {job.serviceId?.name} - {job.subServiceName}
                        </h3>
                        <div className="badge badge-outline badge-info capitalize">
                          {job.status}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(job.scheduledDate).toLocaleDateString()}
                        </span>
                        <Clock className="w-4 h-4 ml-4" />
                        <span>{job.scheduledTime}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>Customer: {job.customerId?.name || "N/A"}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <IndianRupee className="w-4 h-4" />
                        <span
                          className={`font-medium ${
                            job.paymentStatus === "pending"
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {job.paymentStatus}
                        </span>
                      </div>

                      {/* Job Action Buttons for Provider */}
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {job.status === "pending" && (
                          <button
                            onClick={() => updateStatus(job._id, "accepted")}
                            className="btn btn-xs btn-outline btn-success"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Accept
                          </button>
                        )}
                        {job.status === "accepted" && (
                          <button
                            onClick={() => updateStatus(job._id, "in-progress")}
                            className="btn btn-xs btn-outline btn-warning"
                          >
                            Start Job
                          </button>
                        )}
                        {job.status === "in-progress" && (
                          <button
                            onClick={() => updateStatus(job._id, "completed")}
                            className="btn btn-xs btn-outline btn-primary"
                          >
                            Complete Job
                          </button>
                        )}
                      </div>
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

export default MyJobs;
