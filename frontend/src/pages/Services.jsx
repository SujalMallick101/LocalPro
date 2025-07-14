import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { Navigate } from "react-router-dom";

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
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Available Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div key={service._id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-bold">{service.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{service.description}</p>
            <ul className="space-y-1">
              {service.subServices.map((sub, i) => (
                <li key={i} className="text-sm flex justify-between items-center">
                  <span>
                    ✅ {sub.name} - ₹{sub.price} ({sub.duration})
                  </span>
                  {user.role === "customer" && (
                    <button className="ml-4 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">
                      Book
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
