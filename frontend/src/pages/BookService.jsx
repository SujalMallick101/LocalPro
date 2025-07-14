import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { useNavigate, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
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
  const [selectedService, setSelectedService] = useState("");
  const [subServices, setSubServices] = useState([]);
  const [selectedSubService, setSelectedSubService] = useState("");

  const [providers, setProviders] = useState([]);
  const [providerId, setProviderId] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await API.get("/services");
      setServices(data);
    };

    const fetchProviders = async () => {
      const { data } = await API.get("/users?role=provider");
      setProviders(data);
    };

    fetchServices();
    fetchProviders();
  }, []);

  const handleServiceSelect = (serviceId) => {
    const service = services.find((s) => s._id === serviceId);
    setSelectedService(serviceId);
    setSubServices(service?.subServices || []);
    setSelectedSubService("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      providerId,
      serviceId: selectedService,
      subServiceName: selectedSubService,
      scheduledDate,
      scheduledTime,
      address,
    };

    try {
      await API.post("/bookings", payload);
      alert("Booking created!");
      navigate("/bookings");
    } catch (err) {
      console.error(err);
      alert("Failed to book service");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-base-100 rounded-xl shadow-md mt-6">
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

        {/* Sub-service */}
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text flex items-center gap-2">
              <Layers className="w-4 h-4" /> Sub-service
            </span>
          </div>
          <select
            className="select select-bordered w-full"
            required
            onChange={(e) => setSelectedSubService(e.target.value)}
            value={selectedSubService}
          >
            <option value="">Select a sub-service</option>
            {subServices.map((sub, i) => (
              <option key={i} value={sub.name}>
                {sub.name} - ₹{sub.price} ({sub.duration})
              </option>
            ))}
          </select>
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
            onChange={(e) => setProviderId(e.target.value)}
          >
            <option value="">Select a provider</option>
            {providers.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.email})
              </option>
            ))}
          </select>
        </label>

        {/* Date and Time */}
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
              onChange={(e) => setScheduledTime(e.target.value)}
            />
          </label>
        </div>

        {/* Address Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["street", "city", "state", "pincode"].map((field) => (
            <label className="form-control w-full" key={field}>
              <div className="label">
                <span className="label-text flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {field.charAt(0).toUpperCase() + field.slice(1)}
                </span>
              </div>
              <input
                type="text"
                className="input input-bordered"
                placeholder={`Enter ${field}`}
                onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
              />
            </label>
          ))}
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-full mt-4">
          <Send className="w-4 h-4 mr-2" /> Book Now
        </button>
      </form>
    </div>
  );
};

export default BookService;
