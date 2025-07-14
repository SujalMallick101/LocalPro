import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// Lucide icons
import { Hammer, IndianRupee, Clock, BadgeCheck } from "lucide-react";

const Services = () => {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState([]);

  // Redirect unauthenticated users
  if (!user) return <Navigate to="/login" />;

  // Restrict access to only customers and providers
  if (user.role !== "customer" && user.role !== "provider") return <Navigate to="/" />;

  const fetchServices = async () => {
    try {
      const { data } = await API.get("/services");
      setServices(data);
    } catch (error) {
      console.error("Failed to fetch services", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-base-200 px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-2">
            <Hammer className="w-6 h-6" />
            Available Services
          </h2>

          {services.length === 0 ? (
            <p className="text-center text-gray-500">No services available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="card bg-base-100 shadow border border-base-300"
                >
                  <div className="card-body">
                    <h3 className="card-title text-lg text-primary">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {service.description}
                    </p>

                    <ul className="space-y-3">
                      {service.subServices.map((sub, i) => (
                        <li
                          key={i}
                          className="border p-3 rounded bg-base-100 flex flex-col gap-1"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <BadgeCheck className="w-4 h-4 text-success" />
                              {sub.name}
                            </div>
                            {user.role === "customer" && (
                              <button className="btn btn-sm btn-primary">
                                Book
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                            <div className="flex items-center gap-1">
                              <IndianRupee className="w-4 h-4" />
                              ₹{sub.price}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {sub.duration}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
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

export default Services;
