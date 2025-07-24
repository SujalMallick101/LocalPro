import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { ShieldBan, ShieldCheck, Wrench } from "lucide-react";

const AdminManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/admin/services");
      setServices(data);
    } catch (err) {
      setError("Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (id) => {
    try {
      await API.patch(`/admin/services/${id}/status`);
      await fetchServices();
    } catch (err) {
      alert("Failed to update service status.");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-base-100 shadow-sm">
        <Navbar />
      </header>

      {/* Sidebar + Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-64 hidden md:block bg-base-100 border-r border-base-300">
          <Sidebar />
        </aside>

        {/* Main */}
        <main className="flex-1 py-10 px-4">
          <div className="max-w-5xl mx-auto bg-base-100 p-6 rounded-box shadow">
            <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-2">
              Manage Services
            </h2>

            {error && <div className="alert alert-error mb-4">{error}</div>}

            {loading ? (
              <p className="text-center text-gray-500">Loading services...</p>
            ) : services.length === 0 ? (
              <p className="text-center text-gray-500">No services found.</p>
            ) : (
              <div className="space-y-6">
                {services.map((s) => (
                  <div
                    key={s._id}
                    className="card bg-white shadow-md border border-base-300"
                  >
                    <div className="card-body space-y-2">
                      {/* Title & Status */}
                      <div className="flex justify-between items-center">
                        <h3 className="card-title text-lg text-primary">
                          {s.name}
                        </h3>
                        <div
                          className={`badge ${s.isBlocked
                              ? "badge-outline badge-error"
                              : "badge-outline badge-success"
                            }`}
                        >
                          {s.isBlocked ? "Blocked" : "Active"}
                        </div>
                      </div>

                      {/* Provider Info */}
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Provider:</span>{" "}
                        {s.providerId?.name || "N/A"}
                      </p>

                      {/* Category */}
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Category:</span>{" "}
                        {s.category}
                      </p>

                      {/* Price */}
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Price:</span> ₹
                        {s.price}
                      </p>

                      {/* Action Button */}
                      <div className="mt-2">
                        <button
                          onClick={() => toggleBlock(s._id)}
                          className={`btn btn-xs ${s.isBlocked
                              ? "btn-outline btn-success"
                              : "btn-outline btn-error"
                            }`}
                        >
                          {s.isBlocked ? (
                            <>
                              <ShieldCheck className="w-4 h-4 mr-1" />
                              Unblock
                            </>
                          ) : (
                            <>
                              <ShieldBan className="w-4 h-4 mr-1" />
                              Block
                            </>
                          )}
                        </button>
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

export default AdminManageServices;
