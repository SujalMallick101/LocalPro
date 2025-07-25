import { useEffect, useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  Briefcase,
  Layers,
  User,
  Calendar,
  Clock,
  MapPin,
  Send,
} from "lucide-react";

const BookService = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;
  if (user.role !== "customer") return <Navigate to="/" />;

  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);

  const [selectedService, setSelectedService] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [providerId, setProviderId] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Fetch services and providers
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await API.get("/services");
        setServices(data);
      } catch (err) {
        console.error("Failed to fetch services", err);
      }
    };

    const fetchProviders = async () => {
      try {
        const { data } = await API.get("/users?role=provider");
        setProviders(data);
      } catch (err) {
        console.error("Failed to fetch providers", err);
      }
    };

    fetchServices();
    fetchProviders();
  }, []);

  // When user selects a service
  const handleServiceSelect = (serviceId) => {
    setSelectedService(serviceId);
    const selected = services.find((s) => s._id === serviceId);
    if (selected) {
      setSelectedCategory(selected.category || "");
      const relevantProviders = providers.filter(
        (p) => selected.providerId?._id === p._id
      );
      setFilteredProviders(relevantProviders);
    } else {
      setSelectedCategory("");
      setFilteredProviders([]);
    }
    setProviderId("");
  };

  // Submit Booking
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      providerId,
      serviceId: selectedService,
      scheduledDate,
      scheduledTime,
      address,
      subServiceName: "", // Optional if you have subservices
    };

    console.log("Booking Payload:", payload);

    try {
      const res = await API.post("/bookings", payload);
      console.log("Booking Success:", res.data);
      alert("Booking created!");
      navigate("/bookings");
    } catch (err) {
      console.error("Booking Failed:", err);
      alert(`Failed to book service: ${err?.response?.data?.message || err.message}`);
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

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto bg-base-100 rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Briefcase className="w-6 h-6" /> Book a Service
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Service */}
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text flex items-center gap-2">
                    <Layers className="w-4 h-4" /> Service
                  </span>
                </div>
                <select
                  className="select select-bordered w-full"
                  required
                  value={selectedService}
                  onChange={(e) => handleServiceSelect(e.target.value)}
                >
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>

              {/* Category (auto-filled) */}
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text flex items-center gap-2">
                    <Layers className="w-4 h-4" /> Category
                  </span>
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={selectedCategory}
                  disabled
                  readOnly
                />
              </label>

              {/* Provider */}
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text flex items-center gap-2">
                    <User className="w-4 h-4" /> Provider
                  </span>
                </div>
                <select
                  className="select select-bordered w-full"
                  required
                  value={providerId}
                  onChange={(e) => setProviderId(e.target.value)}
                >
                  <option value="">Select a provider</option>
                  {filteredProviders.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.email})
                    </option>
                  ))}
                </select>
              </label>

              {/* Date & Time */}
              <div className="flex flex-col md:flex-row gap-4">
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Date
                    </span>
                  </div>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                </label>

                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Time
                    </span>
                  </div>
                  <input
                    type="time"
                    className="input input-bordered w-full"
                    required
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                </label>
              </div>

              {/* Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["street", "city", "state", "pincode"].map((field) => (
                  <label className="form-control w-full" key={field}>
                    <div className="label">
                      <span className="label-text flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </span>
                    </div>
                    <input
                      type="text"
                      className="input input-bordered"
                      placeholder={`Enter ${field}`}
                      value={address[field]}
                      onChange={(e) =>
                        setAddress({ ...address, [field]: e.target.value })
                      }
                    />
                  </label>
                ))}
              </div>

              {/* Submit */}
              <button type="submit" className="btn btn-primary w-full mt-4">
                <Send className="w-4 h-4 mr-2" /> Book Now
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BookService;
